
// TODO: add singleton for making API requests to backend
// getTags(optionaly with id > a certain id)

import type { Tag } from "../types.js";
import config from '../../config.json' assert { type: 'json'};

class ArtTagAPIRepository {
    async getTags(afterId:bigint|null): Promise<Tag[]> {
        if (afterId && afterId >= 0) {
            
        }
        return []
    }
}