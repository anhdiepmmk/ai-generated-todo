import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '~/models/index';

interface TodoAttributes {
  id?: number;
  title: string;
  completed: boolean;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TodoCreationAttributes extends Optional<TodoAttributes, 'id'> {}

class Todo extends Model<TodoAttributes, TodoCreationAttributes> implements TodoAttributes {
  public id!: number;
  public title!: string;
  public completed!: boolean;
  public userId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Todo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'todos',
    modelName: 'todo',
  }
);

export default Todo;