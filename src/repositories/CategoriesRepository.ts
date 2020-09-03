import { Repository, EntityRepository } from "typeorm";
import Category from "../models/Category";

@EntityRepository(Category)
class Categories extends Repository<Category>{

}

export default Categories
