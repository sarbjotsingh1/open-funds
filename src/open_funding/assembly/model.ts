import { u128Safe as u128 } from "as-bignum"
import { context, RNG } from "near-sdk-as"


// custom class decorator
@nearBindgen
export class Project {
	id: u32
	address: string
	funds: u128
	name: string
	details: string

	constructor(_address: string, _funds: u128, _name: string, _details:string) {
		const rng = new RNG<u32>(1, u32.MAX_VALUE)
		const roll = rng.next()
		this.id = roll // random id
		this.address = _address
		this.funds = _funds
		this.name = _name
		this.details = _details
	}
}
