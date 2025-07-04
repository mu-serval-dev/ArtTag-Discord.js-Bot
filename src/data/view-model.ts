import type { Tag, Artist, StoreOptions } from "../types.js";
import { repo } from "./repository.js";
export const MAX_TAG_LENGTH = 50
export const MAX_ARTIST_LENGTH = 50
export const MAX_URL_LENGTH = 2000
const UPDATE_INTERVAL_MS = 5000
export const TAG_SEPARATOR = " "
export const MAX_IMG_SIZE_MB = 15
export const MAX_NUM_TAGS = 50

/**
 * Class for caching data the client needs for front end presentation, like getting
 * tags and artist names that are in database for example. This is the client's 
 * 'source of truth' with regards to persistent data.
 * 
 * Maintains a regularly updated collection of Tag and Artist objects that
 * exist on the backend.
 */
export class ViewModel {
    /**
     * Map of tags, where key is tag name and value is Tag object.
     */
    private tagsMap:Map<string, Tag> = new Map<string, Tag>()

    /**
     * Map of artists, where key is artist name and value is Artist object.
     */
    private artistsMap:Map<string,Artist> = new Map<string, Artist>()

    /**
     * The newest tag that was fetched from the backend.
     */
    private newestTag:Tag|null = null

    /**
     * The newest artist that was fetched from the backend.
     */
    private newestArtist:Artist|null = null

    /**
     * Create a new ViewModel instance.
     */
    constructor() {
        // initial tags fetch
        this.fetchData()

        // set interval to regularly fetch data from backend
        // need to bind so callback can access 'this' context
        // setInterval(this.fetchTags.bind(this), UPDATE_INTERVAL_MS)
        setInterval(this.fetchData.bind(this), UPDATE_INTERVAL_MS)
    }

    /**
     * Fetch data from API to update this viewmodel.
     */
    private fetchData() {
        this.fetchTags()
        this.fetchArtists()
    }

    /**
     * Fetches tags from backend and updates tagsMap.
     * If newestTag is not null, fetches only tags created after it.
     */
    private fetchTags() {
        let createdAfter = null

        if (this.newestTag) {
            createdAfter = this.newestTag.time_created
        }

        repo.getTags(createdAfter).then(data => {
            
            if (data.length > 0) {
                console.log("[INFO] fetchTags: got tags", data)
                data.forEach(tag => {this.tagsMap.set(tag.name, Object.freeze(tag))})
                this.newestTag = data[data.length - 1] // last tag in the list is the newest
            }
            // else {
            //     console.info("[INFO] fetchTags: no new tags")
            // }
        })
        // .catch(error => {
        //     console.error("[ERROR] fetchTags: failed to fetch:", error)
        // })
    }

    /**
     * Fetches artists from backend and updates artistsMap.
     * If newestArtist is not null, fetches only artists created after it.
     */
    private fetchArtists() {
        let createdAfter = null

        if (this.newestArtist) {
            createdAfter = this.newestArtist.time_created
        }

        repo.getArtists(createdAfter).then(data => {
            
            if (data.length > 0) {
                console.log("[INFO] fetchArtists: got artists", data)
                data.forEach(artist => {this.artistsMap.set(artist.name, Object.freeze(artist))})
                this.newestArtist = data[data.length - 1] // last artist in the list is the newest
            }
            // else {
            //     console.info("[INFO] fetchTags: no new tags")
            // }
        })
        // .catch(error => {
        //     console.error("[ERROR] fetchTags: failed to fetch:", error)
        // })
    }

    /**
     * Get all tags that do not have the names in the given set.
     * @param names Set of tag names to filter out.
     * @returns Array of immutable Tag objects that do not have the names in the given set.
     */
    public getTagsNotIn(names:Set<string>): Array<Tag> {
        const tags = new Set(this.tagsMap.keys());
        const keys = tags.difference(names);
        const result:Array<Tag> = [];
        for (const key of keys) {
            result.push(this.tagsMap.get(key) as Tag);
        }
        return result;
    }

    /**
     * Get all artists whose name begins with the given prefix.
     * @param name Prefix to filter on.
     * @returns Array of immutable Artist objects whose name begins with the given prefix.
     */
    public getArtistsBeginningWith(prefix: string): Array<Artist> {
        const artists = this.artistsMap.values();
        const result = new Array<Artist>();
        artists.forEach((artist, _) => {
            if (artist.name.startsWith(prefix, 0)) {
                result.push(artist)
            }
        })
        return result;
    }


    // public addTags(tags: Array<string>): boolean {
    //     // TODO: try to create tag with given name
    //     // Call repo tmethod to add
    //     // If successful, get back id of new tag
    //     //     If id is just newestTag's id + 1, add to list
    //     //     If id is more than newestTag's id + 1, fetch updates from API
    //     // If not, return false
    //     return false
    // }

    // public addArtist(name: string): boolean {
    //     return false
    // }

    /**
     * Returns true iff a tag with the given name 
     * exists in the view model.
     */
    public tagExists(name: string): boolean {
        return this.tagsMap.has(name);
    }

    /**
     * Returns true iff an artist with the given name 
     * exists in the view model.
     */
    public artistExists(name: string): boolean {
        return this.artistsMap.has(name)
    }

    /**
     * Return true iff the given tag name is valid.
     */
    public isValidTagName(name: string): boolean {
        return name.length <= MAX_TAG_LENGTH && name.length > 0 && !name.includes(TAG_SEPARATOR);
    }

    /**
     * Return true iff the given artist name is valid.
     */
    public isValidArtistName(name: string): boolean {
        return name.length <= MAX_ARTIST_LENGTH && name.length > 0;
    }

    /**
     * Attempt to store an image. Returns a string error if fails.
     * @param options Options for the store command, including the image, tags, and other metadata
     * @returns Error message on failure
     */
    public async storeImage (options: StoreOptions): Promise<string | null> {
        const err = await this.validateStoreOptions(options)
        if (err) {
            return err;
        }

        // TODO: check if there are similar images already stored

        //
        return null;
    }

    /**
     * Ensures all options provided to the store command are valid and
     * follow the necessary rules. Returns null iff options are all valid.
     * 
     * Attempts to store any provided tags that are not on the backend
     * already. Attempts to store artist name if provided and not on 
     * backend already.
     * 
     * @param options 
     * @returns Error message if something is invalid, else null
     */
    private async validateStoreOptions(options: StoreOptions): Promise<string | null> {
        // VALIDATION
    
        // 1. image
        //      - image type
        if (!options.image.contentType?.startsWith("image/")) {
            return 'Oops, that wasn\'t an image! Make sure your attachment is an JPEG, PNG, WebP, GIF or AVIF file'
        }
        //      - size
        if (options.image.size > (MAX_IMG_SIZE_MB * 1000000)) {
            return `Your image is too big! Make sure your image is less than ${MAX_IMG_SIZE_MB}MB`
        }
        // 2. tags
        //      - no more than 50 tags
        if (options.tags.length > MAX_NUM_TAGS) {
            return `Too many tags! We only support up to ${MAX_NUM_TAGS} per image upload`
        }

        
        
        const tagsToMake = [] // list of tags that aren't stored yet but are valid
        // ensure all associated tags are valid
        for (let i = 0; i < options.tags.length; i++) {
            const tag = options.tags[i]

            if (!this.isValidTagName(tag)) {
                return `'${tag}' is not a valid tag name`
            }

            if (!this.tagExists(tag)) {
                tagsToMake.push(tag)
            }
        }

        // make any missing tags
        // NOTE: rely on regular api fetching to pull newly created tags
        if (tagsToMake.length > 0 && !(await repo.createTags(tagsToMake))) {
            console.log("Failed to make")
            return 'Oops! Failed to store some new tags'
        }

        // 3. artist
        if (options.artist) {
            // ensure artist name follows rules if present
            if (!this.isValidArtistName(options.artist)) {
                return `${options.artist} is not a valid artist name`
            }
            // attempt to store new artist name
            if (!this.artistExists(options.artist) && !(await repo.createArtist(options.artist))) {
                return `Oops! Failed to create that artist`
            }
        }

        // 4. url
        if (options.url) {
            // ensure url is valid if present
            try {
                const url = new URL(options.url)
            }
            catch (_) {
                return 'Oops! That url is invalid'
            }
        }
        return null;
    }
}