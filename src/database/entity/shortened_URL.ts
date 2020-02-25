import {
	CreateDateColumn,
	Entity,
	Index,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
	Column,
	AfterUpdate
} from "typeorm";


@Entity({ name: "shortened_URL" })
export default class shortened_URL {
	@PrimaryGeneratedColumn()
	public id: number;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Index()
	@Column({ type: "varchar", nullable: false })
	public shortend: string;
	
	@Column({ type: "varchar", nullable: false })
    public original: string;
    
    @Column({ type: "integer", nullable: false, default:0 })
	public count: string;

	@AfterUpdate()
	updateCounters() {
		this.updatedAt = new Date();
	}

}
