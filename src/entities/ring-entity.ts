import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import {
  IsUUID,
  Length,
  IsDate,
  IsString,
  IsOptional,
  IsAlpha,
  IsAlphanumeric,
  IsInt,
  Min,
  Max,
  IsNumberString,
  IsNumber,
  IsArray,
} from 'class-validator';
import { IsAlphaWithHyphen, IsAlphanumericWithHyphen, IsNumberStringWithHyphen } from '../validation/custom-decorators';
import { equalLength } from '../validation/validation-messages';
import {
  AccuracyOfCoordinates,
  Sex,
  Age,
  RingingScheme,
  PrimaryIdentificationMethod,
  VerificationOfTheMetalRing,
  MetalRingInformation,
  OtherMarksInformation,
  Species,
  SpeciesDto,
  Manipulated,
  MovedBeforeTheCapture,
  CatchingMethod,
  CatchingLures,
  Status,
  BroodSize,
  PullusAge,
  AccuracyOfPullusAge,
  PlaceCode,
  Conditions,
  Circumstances,
  CircumstancesPresumed,
  AccuracyOfDate,
  EURINGCodeIdentifier,
  StatusOfRing,
  PlaceCodeDto,
} from './euring-codes';
import { User, UserDto } from './user-entity';
import { Person, PersonDto } from './person-entity';
import { Observation } from './observation-entity';
import Mark from './submodels/Mark';
import { EURINGCodes, AbleToImportEURINGCode, EURINGEntityDto } from './common-interfaces';
import { ColumnNumericTransformer } from '../utils/ColumnNumericTransformer';
import EURINGCodeParser from '../utils/EURINGCodeParser';

export interface RawRingDto {
  // FIXME update DTO
  latitude: number | null;
  longitude: number | null;
}

export interface RingDto extends EURINGCodes {
  id: string;
  metalRingInformation: EURINGEntityDto;
  otherMarksInformation: EURINGEntityDto;
  otherMarks: Mark[];
  speciesMentioned: SpeciesDto;
  speciesConcluded: SpeciesDto;
  manipulated: EURINGEntityDto;
  movedBeforeTheCapture: EURINGEntityDto;
  catchingMethod: EURINGEntityDto;
  catchingLures: EURINGEntityDto;
  sexMentioned: EURINGEntityDto;
  sexConcluded: EURINGEntityDto;
  ageMentioned: EURINGEntityDto;
  ageConcluded: EURINGEntityDto;
  status: EURINGEntityDto;
  broodSize: EURINGEntityDto;
  pullusAge: EURINGEntityDto;
  accuracyOfPullusAge: EURINGEntityDto;
  latitude: number | null;
  longitude: number | null;
  placeCode: PlaceCodeDto;
  accuracyOfCoordinates: EURINGEntityDto;
  condition: EURINGEntityDto;
  circumstances: EURINGEntityDto;
  circumstancesPresumed: EURINGEntityDto;
  date: Date | null;
  accuracyOfDate: EURINGEntityDto;
  euringCodeIdentifier: EURINGEntityDto;
  remarks: string | null;
  offlineRinger: PersonDto;
  ringer: UserDto;
  statusOfRing: EURINGEntityDto;
}

@Entity()
export class Ring implements RingDto, AbleToImportEURINGCode, EURINGCodes {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  // Related fields in access 'Ring number', Identification series', 'Dots' and 'Identification number'.
  // Need to sum series, dots and id number in order to get Ring number. See documentation.
  @Length(10, 10, { message: equalLength(10) })
  @Column({
    type: 'varchar',
    unique: true,
  })
  public identificationNumber: string;

  @OneToMany(
    () => Observation,
    m => m.ring,
  )
  public observation: Observation[];

  @IsAlpha()
  @Length(3, 3, { message: equalLength(3) })
  @ManyToOne(
    () => RingingScheme,
    m => m.ring,
    {
      eager: true,
    },
  )
  public ringingScheme: RingingScheme;

  @IsAlphanumeric()
  @Length(2, 2, { message: equalLength(2) })
  @ManyToOne(
    () => PrimaryIdentificationMethod,
    m => m.ring,
    {
      eager: true,
    },
  )
  public primaryIdentificationMethod: PrimaryIdentificationMethod;

  @IsInt()
  @Min(0)
  @Max(9)
  @ManyToOne(
    () => VerificationOfTheMetalRing,
    m => m.ring,
    {
      eager: true,
    },
  )
  public verificationOfTheMetalRing: VerificationOfTheMetalRing;

  @IsInt()
  @Min(0)
  @Max(7)
  @ManyToOne(
    () => MetalRingInformation,
    m => m.ring,
    {
      eager: true,
    },
  )
  public metalRingInformation: MetalRingInformation;

  @IsAlpha()
  @Length(2, 2, { message: equalLength(2) })
  @ManyToOne(
    () => OtherMarksInformation,
    m => m.ring,
    {
      eager: true,
    },
  )
  public otherMarksInformation: OtherMarksInformation;

  // Not presented in euring standard
  @IsOptional()
  @IsArray()
  @Column('jsonb', { nullable: true, default: null })
  public otherMarks: Mark[];

  @IsNumberString()
  @Length(5, 5, { message: equalLength(5) })
  @ManyToOne(
    () => Species,
    m => m.mentionedInRing,
    {
      eager: true,
    },
  )
  public speciesMentioned: Species;

  @IsNumberString()
  @Length(5, 5, { message: equalLength(5) })
  @ManyToOne(
    () => Species,
    m => m.concludedInRing,
    {
      eager: true,
    },
  )
  public speciesConcluded: Species;

  @IsAlpha()
  @Length(1, 1, { message: equalLength(1) })
  @ManyToOne(
    () => Manipulated,
    m => m.ring,
    {
      eager: true,
    },
  )
  public manipulated: Manipulated;

  @IsInt()
  @Min(0)
  @Max(9)
  @ManyToOne(
    () => MovedBeforeTheCapture,
    m => m.ring,
    {
      eager: true,
    },
  )
  public movedBeforeTheCapture: MovedBeforeTheCapture;

  @IsAlphaWithHyphen()
  @Length(1, 1, { message: equalLength(1) })
  @ManyToOne(
    () => CatchingMethod,
    m => m.ring,
    {
      eager: true,
    },
  )
  public catchingMethod: CatchingMethod;

  @IsAlphaWithHyphen()
  @Length(1, 1, { message: equalLength(1) })
  @ManyToOne(
    () => CatchingLures,
    m => m.ring,
    {
      eager: true,
    },
  )
  public catchingLures: CatchingLures;

  @IsAlpha()
  @Length(1, 1, { message: equalLength(1) })
  @ManyToOne(
    () => Sex,
    m => m.mentionedInRing,
    {
      eager: true,
    },
  )
  public sexMentioned: Sex;

  @IsAlpha()
  @Length(1, 1, { message: equalLength(1) })
  @ManyToOne(
    () => Sex,
    m => m.concludedInRing,
    {
      eager: true,
    },
  )
  public sexConcluded: Sex;

  @IsAlphanumeric()
  @Length(1, 1, { message: equalLength(1) })
  @ManyToOne(
    () => Age,
    m => m.mentionedInRing,
    {
      eager: true,
    },
  )
  public ageMentioned: Age;

  @IsAlphanumeric()
  @Length(1, 1, { message: equalLength(1) })
  @ManyToOne(
    () => Age,
    m => m.concludedInRing,
    {
      eager: true,
    },
  )
  public ageConcluded: Age;

  @IsAlphaWithHyphen()
  @Length(1, 1, { message: equalLength(1) })
  @ManyToOne(
    () => Status,
    m => m.ring,
    {
      eager: true,
    },
  )
  public status: Status;

  @IsNumberStringWithHyphen()
  @Length(2, 2, { message: equalLength(2) })
  @ManyToOne(
    () => BroodSize,
    m => m.ring,
    {
      eager: true,
    },
  )
  public broodSize: BroodSize;

  @IsNumberStringWithHyphen()
  @Length(2, 2, { message: equalLength(2) })
  @ManyToOne(
    () => PullusAge,
    m => m.ring,
    {
      eager: true,
    },
  )
  public pullusAge: PullusAge;

  @IsAlphanumericWithHyphen()
  @Length(1, 1, { message: equalLength(1) })
  @ManyToOne(
    () => AccuracyOfPullusAge,
    m => m.ring,
    {
      eager: true,
    },
  )
  public accuracyOfPullusAge: AccuracyOfPullusAge;

  // Related fields in access 'Lat deg', 'Lat min', 'Lat sec'
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  @Column('decimal', {
    precision: 10,
    scale: 8,
    nullable: true,
    default: null,
    transformer: new ColumnNumericTransformer(),
  })
  public latitude: number | null;

  // Related fields in access 'Lon deg', 'Lon min', 'Lon sec'
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  @Column('decimal', {
    precision: 11,
    scale: 8,
    nullable: true,
    default: null,
    transformer: new ColumnNumericTransformer(),
  })
  public longitude: number | null;

  @IsAlphanumericWithHyphen()
  @Length(4, 4, { message: equalLength(4) })
  @ManyToOne(
    () => PlaceCode,
    m => m.ring,
    {
      eager: true,
    },
  )
  public placeCode: PlaceCode;

  public get placeName(): null {
    return null;
  }

  @IsInt()
  @Min(0)
  @Max(9)
  @ManyToOne(
    () => AccuracyOfCoordinates,
    m => m.ring,
    {
      eager: true,
    },
  )
  public accuracyOfCoordinates: AccuracyOfCoordinates;

  @IsInt()
  @Min(0)
  @Max(9)
  @ManyToOne(
    () => Conditions,
    m => m.ring,
    {
      eager: true,
    },
  )
  public condition: Conditions;

  @IsNumberString()
  @Length(2, 2, { message: equalLength(2) })
  @ManyToOne(
    () => Circumstances,
    m => m.ring,
    {
      eager: true,
    },
  )
  public circumstances: Circumstances;

  @IsInt()
  @Min(0)
  @Max(1)
  @ManyToOne(
    () => CircumstancesPresumed,
    m => m.ring,
    {
      eager: true,
    },
  )
  public circumstancesPresumed: CircumstancesPresumed;

  @IsDate()
  @Column('varchar', { nullable: true, default: null })
  public date: Date | null;

  @IsInt()
  @Min(0)
  @Max(9)
  @ManyToOne(
    () => AccuracyOfDate,
    m => m.ring,
    {
      eager: true,
    },
  )
  public accuracyOfDate: AccuracyOfDate;

  @IsInt()
  @Min(0)
  @Max(4)
  @ManyToOne(
    () => EURINGCodeIdentifier,
    m => m.ring,
    {
      eager: true,
    },
  )
  public euringCodeIdentifier: EURINGCodeIdentifier;

  // Related field in access 'Note'
  @IsOptional()
  @IsString()
  @Column('varchar', { nullable: true, default: null })
  public remarks: string | null;

  // Not presented in euring standart
  @IsUUID()
  @ManyToOne(
    () => User,
    m => m.ring,
    {
      eager: true,
    },
  )
  public ringer: User;

  // Related field in access 'Ringer' referred to table 'Ringer Information'
  @IsUUID()
  @ManyToOne(
    () => Person,
    m => m.ring,
    {
      eager: true,
    },
  )
  public offlineRinger: Person;

  // Not presented in euring standart
  @IsOptional()
  @IsAlpha()
  @Length(1, 1, { message: equalLength(1) })
  @ManyToOne(
    () => StatusOfRing,
    m => m.ring,
    {
      eager: true,
    },
  )
  public statusOfRing: StatusOfRing;

  public get distance(): null {
    return null;
  }

  public get elapsedTime(): null {
    return null;
  }

  public get direction(): null {
    return null;
  }

  public static create(ring: RawRingDto & { ringer: string }): Ring {
    return Object.assign(new Ring(), ring);
  }

  public importEURING(code: string): Ring {
    const preEntity = EURINGCodeParser(code);
    // todo add handling of needed props
    return Object.assign(this, preEntity);
  }
}
