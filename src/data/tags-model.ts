import type { Tag } from "../types.js";
import { repo } from "./repository.js";
export const MAX_TAG_LENGTH = 50
const UPDATE_INTERVAL_MS = 5000
export const TAG_SEPARATOR = ","

/**
 * Class for managing client state with respect to Tags.
 * Maintains a regularly updated list of Tag objects that
 * exist in backend.
 */
export class TagsViewModel {
    // TODO: reset to empty array when testing is done
    private tagsList:Array<Tag> = []
    
    get newestId():bigint|null {
        return (this.tagsList.length === 0)? null : this.tagsList[this.tagsList.length - 1].tag_id
    }

    constructor() {
        // TODO: register interval callback for fetching new tags from api
        // TODO: fetch initial list from API
        
        repo.getTags().then(data => {
            this.tagsList = data
            // console.log(this.newestId)
        })
        // need to call bind so it gets ref to newestId
        setInterval(this.fetchTags.bind(this), UPDATE_INTERVAL_MS)
    }

    private fetchTags() {
        console.log("Fetching tags...")

        repo.getTags(this.newestId).then(data => {
            console.log(`Got`)
            this.tagsList = this.tagsList.concat(data)
        })
        // TODO: update tagsList by fetching all tags with id > newestTag.tag_id
        // NOTE: if tags can be deleted, we need another way to find if one was deleted
    }

    /**
     * Get up to maxResults tags that start with given prefix.
     * @param prefix 
     * @param maxResults 
     * @returns Array of tags beginning with given prefix.
     */
    public getTagsWithPrefix(prefix: string, maxResults:number = 25): Array<Tag> {
        const cap = Math.max(maxResults, 1) //
        const filtered = this.tagsList.filter(tag => {return tag.tag_name.startsWith(prefix, 0)})
        return filtered.slice(0, Math.min(maxResults, filtered.length))
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
        for (let i = 0; i < this.tagsList.length; i++) {
            const curr = this.tagsList[i]
            if (curr.tag_name === name) {
                return true;
            }
        }
        return false;
        // return this.tagsList.filter(tag => {tag.tag_name === name}).length != 0
    }

    /**
     * Return true iff the given tag name is valid.
     */
    public validateTagName(name: string): boolean {
        return name.length <= MAX_TAG_LENGTH && !name.includes(TAG_SEPARATOR) && !name.includes(' ');
    }
}