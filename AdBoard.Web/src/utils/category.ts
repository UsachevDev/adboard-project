import { CategoryDto } from "@/lib/api";
import { Category } from "@/types";

export const mapCategory = (dto: CategoryDto): Category => ({
    id: dto.id,
    name: dto.name,
    image: undefined,
    subcategories: dto.subcategories.map((sub) => ({
        id: sub.id,
        name: sub.name,
        image: undefined,
        category: { id: dto.id, name: dto.name, image: undefined },
    })),
});

export default mapCategory;