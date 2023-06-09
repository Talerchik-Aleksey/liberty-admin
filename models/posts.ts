import {
  Table,
  Column,
  DataType,
  AllowNull,
  Model,
  Default,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Users } from "./users";

@Table({
  timestamps: true,
  paranoid: true,
  underscored: true,
  tableName: "posts",
  initialAutoIncrement: "1",
})
export class Posts extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.NUMBER)
  id!: number;

  @AllowNull(false)
  @Column(DataType.NUMBER)
  @ForeignKey(() => Users)
  author_id!: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  title!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  category!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  description!: string;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  is_public!: boolean;

  @AllowNull(true)
  @Column(DataType.STRING)
  location_name!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  street!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  city!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  state!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  zip!: string;

  @Column({
    type: DataType.GEOMETRY("POINT", 4326),
  })
  geo!: any;

  @AllowNull(false)
  @Default(true)
  @Column(DataType.BOOLEAN)
  is_enabled!: boolean;

  @AllowNull(true)
  @Column(DataType.DECIMAL)
  lat!: number;

  @AllowNull(true)
  @Column(DataType.DECIMAL)
  lng!: number;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  is_blocked!: boolean;

  @BelongsTo(() => Users, { foreignKey: "author_id" })
  users?: Users;
}
