import type { Tag, Artist } from "../types.js";
import { repo } from "./repository.js";
export const MAX_TAG_LENGTH = 50
export const MAX_ARTIST_LENGTH = 50
const UPDATE_INTERVAL_MS = 5000
export const TAG_SEPARATOR = " "

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


    public addTag(name: string): boolean {
        // TODO: try to create tag with given name
        // Call repo tmethod to add
        // If successful, get back id of new tag
        //     If id is just newestTag's id + 1, add to list
        //     If id is more than newestTag's id + 1, fetch updates from API
        // If not, return false
        return false
    }

    /**
     * Returns true iff a tag with the given name 
     * exists in the view model.
     */
    public tagExists(name: string): boolean {
        return this.tagsMap.has(name);
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
}