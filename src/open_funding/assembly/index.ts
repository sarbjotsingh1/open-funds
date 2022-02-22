import { Project } from "./model"
import {
	context,
	ContractPromiseBatch,
	logging,
	PersistentMap,
	PersistentVector,
	u128,
	Value,
} from "near-sdk-as"

// key:value map
// every map contains a prefix like `("u")` that should be unique
// they represent unique are storage prefixes

export const userList = new PersistentMap<string, u32>("u")
export const userIdList = new PersistentVector<string>("ul") // contains all user id
export const projects = new PersistentMap<u32, Project>("p")
export const userProjectMap = new PersistentMap<
	string,
	PersistentMap<u32, Project>
>("up")
export const projectIdList = new PersistentVector<u32>("pl") // contains all project id

// register USER function
let i = 0
export function registerUSER(address: string): string {
	if (!userList.contains(address)) {
		userList.set(address, i) // set user id(random)
		userIdList.push(address) // Add user id to the List
		i++
	}
	return address
}

// register Project
export function addProject(
	userId: string,
	address: string,
	name: string,
	details: string,
	funds: string,
): u32 {
	// const userInstance = userList.getSome(userId) // gets the user from the list
	userId = registerUSER(userId)
	// logging
	logging.log("Project Address - " + address)
	logging.log("Project Name - " + name)
	logging.log("Project Details - " + details)
	logging.log("Funds - " + funds)

	const funds_u128 = u128.from(funds)
	const newProject = new Project(address, funds_u128, name, details) // Project constructor from Model.ts

	projects.set(newProject.id, newProject) // add new project to project list
	userProjectMap.set(userId, projects) // map user to all of their projects
	projectIdList.push(newProject.id) // add project id to the project lis

	return 0
}

// Get function to get the list of users
export function getUsers(): Array<string> {
	let users = new Array<string>()

	// put all user.id to users
	for (let i = 0; i < userIdList.length; i++) {
		users.push(userIdList[i])
	}

	return users
}

// Get function to get the list of all projects by a user
export function getProjects(userId: string): Array<u32> {
	let projectList = new Array<u32>()
	let projectByUser = userProjectMap.getSome(userId)

	for (let i = 0; i < projectIdList.length; i++) {
		if (projectByUser.contains(projectIdList[i])) {
			projectList.push(projectIdList[i])
		}
	}

	return projectList
}

// Function to get all projects listed on the platform
export function allProjects(): Array<u32> {
	let projectList = new Array<u32>()

	for (let i = 0; i < projectIdList.length; i++) {
		projectList.push(projectIdList[i])
	}

	return projectList
}

export function projectData(id: u32): Project {
	const Data = projects.getSome(id)
	return Data
}

// cross-contract call
// documentation - https://near.github.io/near-sdk-as/classes/_sdk_core_assembly_promise_.contractpromisebatch.html
export function donate(userId: string, projectId: u32, amount: u64): string {
			const projects = userProjectMap.getSome(userId)
			const project = projects.getSome(projectId)

			project.funds = u128.sub(project.funds, context.attachedDeposit)
			projects.set(project.id, project)
			userProjectMap.set(userId, projects)

			const to_benificiary = ContractPromiseBatch.create(project.address)
			to_benificiary.transfer(u128.from(amount))
			return "Done"
}

// export function donate(userId: string, projectId: u32, amount: u64): string {
// 	const projects = userProjectMap.getSome(userId)
// 	const project = projects.getSome(projectId)

// 	project.funds = u128.sub(project.funds, context.attachedDeposit)
// 	projects.set(project.id, project)
// 	userProjectMap.set(userId, projects)

// 	const to_benificiary = ContractPromiseBatch.create(project.address)
// 	to_benificiary.transfer(u128.from(amount))
// 	return "Done"
// }