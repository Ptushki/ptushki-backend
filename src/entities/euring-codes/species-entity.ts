import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Ring } from '../ring-entity';
import { BasaRing } from '../basa-ring-entity';
import { Observation } from '../observation-entity';

// Related tables in access 'Species' and 'Species by Schem'
@Entity()
export class Species {
  @PrimaryColumn()
  public id: string;

  @Column('varchar', { nullable: true, default: null })
  public belCode: number;

  @Column('varchar', { nullable: true, default: null })
  public species: string | null;

  @Column('varchar', { nullable: true, default: null })
  public ordo: string | null;

  @Column('varchar', { nullable: true, default: null })
  public family: string | null;

  @OneToMany(() => Ring, m => m.speciesMentioned)
  public ringMentioned: Ring[];

  @OneToMany(() => Ring, m => m.speciesConcluded)
  public ringConcluded: Ring[];

  @OneToMany(() => Observation, m => m.speciesMentioned)
  public observationMentioned: Observation[];

  @OneToMany(() => Observation, m => m.speciesConcluded)
  public observationConcluded: Observation[];

  @OneToMany(() => BasaRing, m => m.species)
  public basaRing: BasaRing[];
}
