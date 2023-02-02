import {
  Table,
  Column,
  DataType,
  AllowNull,
  Model,
  Default,
  PrimaryKey,
  AutoIncrement,
  HasMany,
} from "sequelize-typescript";
import { Posts } from "./posts";

@Table({
  timestamps: true,
  paranoid: true,
  underscored: true,
  tableName: "users",
  initialAutoIncrement: "1",
})
export class Users extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.NUMBER)
  id!: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  email!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  password!: string;

  @AllowNull(true)
  @Default("")
  @Column(DataType.STRING)
  reset_pwd_token: string | undefined;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  is_admin!: boolean;

  @AllowNull(false)
  @Default(true)
  @Column(DataType.BOOLEAN)
  is_enabled!: boolean;

  @HasMany(() => Posts, { foreignKey: "author_id" })
  posts?: Posts[];
}
