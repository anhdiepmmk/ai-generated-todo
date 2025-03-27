import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from './index';
import bcrypt from 'bcryptjs';

interface UserAttributes {
  id?: number;
  email: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public passwordHash!: string;
  public firstName?: string;
  public lastName?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  async validPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash); // Use passwordHash here
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: 'users',
    modelName: 'user',
    hooks: {
      beforeCreate: async (user) => {
        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
      }
    }
  }
);

export default User;