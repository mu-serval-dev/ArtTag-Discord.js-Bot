import type { Tag } from "../types.js";

const MAX_TAG_LENGTH = 50
const UPDATE_INTERVAL_MS = 5000

/**
 * Class for managing client state with respect to Tags.
 * Maintains a regularly updated list of Tag objects that
 * exist in backend.
 */
class TagsViewModel {
    private tagsList:Array<Tag> = []
    get newestId():BigInt {
        return (this.tagsList.length === 0)? 0n : this.tagsList[this.tagsList.length - 1].tag_id
    }

    constructor() {
        // TODO: register interval callback for fetching new tags from api
        // TODO: fetch initial list from API
        setInterval(this.fetchTags, UPDATE_INTERVAL_MS)
    }

    private fetchTags() {
        // TODO: update tagsList by fetching all tags with id > newestTag.tag_id
    }

    /**
     * Get up to maxResults tags that start with given prefix.
     * @param prefix 
     * @param maxResults 
     * @returns Array of tags beginning with given prefix.
     */
    public getTagsWithPrefix(prefix: string, maxResults:number = 25): Array<Tag> {
        const filtered = this.tagsList.filter(tag => {tag.tag_name.startsWith(prefix)})
        return filtered.slice(0, Math.min(maxResults, filtered.length - 1))
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
     * Check if a tag with the given name exists in the view model.
     * @param name Tag name
     * @returns True if a tag with that name exists in the local model
     */
    public tagExists(name: string): boolean {
        return this.tagsList.filter(tag => {tag.tag_name === name}).length != 0
    }

    /**
     * Return true iff the given tag name is valid.
     */
    public validateTagName(name: string): boolean {
        return name.length <= MAX_TAG_LENGTH && !name.includes(',') && !name.includes(' ');
    }
}