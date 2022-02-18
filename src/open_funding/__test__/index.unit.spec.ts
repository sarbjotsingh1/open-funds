import * as contract from "../assembly"
import { logging, u128, VMContext } from "near-sdk-as"

describe("registerUSER", () => {
	it("register a user", () => {
		const userId1 = contract.registerUSER()
		const userId2 = contract.registerUSER()
		log(contract.userIdList)
		const projectList = contract.allProjects()
		log(projectList)
		expect(contract.userIdList.length).toBeGreaterThan(0)
	})
})

// describe("addProject", () => {
// 	it("add project", () => {
// 		const usr = contract.registerUSER()
// 		// user 1 - two project
// 		contract.addProject(
// 			usr,
// 			"projectowner1.testnet",
// 			"test_project_1",
// 			"some details",
// 			"1000000000000000000000",
// 		)
// 		log("first project of user 1 registered")

// 		contract.addProject(
// 			usr,
// 			"projectowner1.testnet",
// 			"test_project_2",
// 			"some details, anything",
// 			"0",
// 		)
// 		log("second project of user 1 registered")

// 		// user 2 - one project
// 		contract.addProject(
// 			usr,
// 			"projectuser2.testnet",
// 			"test_project from user2",
// 			"some details again",
// 			"0",
// 		)

// 		log("first project of user 2 registered")
// 		expect(contract.projectIdList.length).toBeGreaterThan(0)
// 	})
// })
