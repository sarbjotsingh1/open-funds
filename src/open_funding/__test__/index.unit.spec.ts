import * as contract from "../assembly"
import { context, logging, u128, VMContext } from "near-sdk-as"

describe("registerUSER", () => {
	it("register a user", () => {
		const userId1 = contract.registerUSER("abcd.testnet")
		const userId2 = contract.registerUSER("xyz.testnet")
		const userId3 = contract.registerUSER("asdf.testnet")
		const userId4 = contract.registerUSER("xyz.testnet")

		log(contract.userIdList)
		log(contract.userList.getSome("asdf.testnet"))
		log(contract.userList.getSome("xyz.testnet"))

		const projectList = contract.allProjects()
		log(projectList)
		expect(contract.userIdList.length).toBeGreaterThan(0)
	})
})

describe("addProject", () => {
	it("add project", () => {
		const usr = contract.registerUSER("test.testnet")
		// user 1 - two project
		contract.addProject(
			usr,
			"projectowner1.testnet",
			"test_project_1",
			"some details",
			"1000000000000000000000",
		)
		log("first project of user 1 registered")

		contract.addProject(
			usr,
			"projectowner1.testnet",
			"test_project_2",
			"some details, anything",
			"0",
		)
		log("second project of user 1 registered")

		const usr2 = contract.registerUSER("second.testnet")

		// user 2 - one project
		contract.addProject(
			usr2,
			"projectuser2.testnet",
			"test_project from user2",
			"some details again",
			"0",
		)

		log(contract.getUsers())
		log(contract.allProjects())
		log(contract.getProjects(usr))
		log("get project detail")
		// log(contract.projects.getSome(543516756))
		log(contract.donate(context.sender, 1919116659, 10))
		expect(contract.projectIdList.length).toBeGreaterThan(0)
	})
})
