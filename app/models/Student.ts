import {Entity, BaseEntity, ObjectID, ObjectIdColumn, Column} from "typeorm"; 

@Entity() 
export default class Student extends BaseEntity {
   @ObjectIdColumn() 
   id: ObjectID; 
   
   @Column() 
   Name: string; 
   
   @Column() 
   Country: string; 
}