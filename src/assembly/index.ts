import { USER, Project } from "./model"
import { logging, PersistentMap, PersistentVector, u128 } from "near-sdk-as"

// key:value map
// every map contains a prefix like `("u")` that should be unique
// they represent unique are storage prefixes

export const userList = new PersistentMap<u32, USER>("u")
export const userIdList = new PersistentVector<u32>("ul") // contains all user id
export const projects = new PersistentMap<u32, Project>("p")
export const userProjectMap = new PersistentMap<
	u32,
	PersistentMap<u32, Project>
>("up")
export const projectIdList = new PersistentVector<u32>("pl") // contains all project id

// register USER function
export function registerUSER(): u32 {
	const user = new USER()
	userList.set(user.id, user) // set user id(random)
	userIdList.push(user.id) // Add user id to the List
	return user.id
}

// register Project
export function addProject(
	userId: u32,
	address: string,
	name: string,
	details: string,
	funds: string,
): u32 {
	const userInstance = userList.getSome(userId) // gets the user from the list

	// logging
	logging.log("Project Address - " + address)
	logging.log("Project Name - " + name)
	logging.log("Project Details - " + details)
	logging.log("Funds - " + funds)

	const funds_u128 = u128.from(funds)
	const newProject = new Project(address, funds_u128, name, details) // Project constructor from Model.ts

	// pushing new project to the list
	if (userInstance != null) {
		logging.log("user Instance is not null")
		projects.set(newProject.id, newProject) // add new project to project list
		userProjectMap.set(userId, projects) // map user to all of their projects
		projectIdList.push(newProject.id) // add project id to the project list
	} else {
		logging.log("user instance is null")
	}

	return 0
}
