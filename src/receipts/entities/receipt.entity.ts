import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('receipts')
export class Receipt {

    @PrimaryGeneratedColumn('uuid')
    receiptId: string;

    @Column()
    issuedAt: Date;

    @Column()
    name: string;

    @Column()
    price: number;
}
