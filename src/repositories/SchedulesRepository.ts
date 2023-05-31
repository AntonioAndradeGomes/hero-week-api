import { endOfDay, startOfDay } from "date-fns";
import { prisma } from "../database/prisma";
import { ICreateSchedules } from "../interfaces/SchedulesInterface";

class SchedulesRepository {
  //todo: aula 2 - 56:40 https://www.youtube.com/watch?v=aYHhnX3qSPY&ab_channel=HeroCode
  async create({ name, phone, date }: ICreateSchedules) {
    const result = await prisma.schedule.create({
      data: {
        name,
        phone,
        date,
      },
    });
    return result;
  }

  async findByDate(date: Date) {
    const result = await prisma.schedule.findFirst({
      where: { date },
    });
    return result;
  }

  async findAll(date: Date) {
    const result = await prisma.schedule.findMany({
      where: {
        date: {
          gte: startOfDay(date),
          lt: endOfDay(date),
        },
      },
      orderBy: {
        date: "asc",
      },
    });
    return result;
  }

  async update(id: string, date: Date) {
    const result = await prisma.schedule.update({
      where: { id },
      data: {
        date,
      },
    });
    return result;
  }
}

export { SchedulesRepository };
