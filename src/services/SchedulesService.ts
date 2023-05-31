import { ICreateSchedules } from "../interfaces/SchedulesInterface";
import { isBefore, startOfHour } from "date-fns";
import { SchedulesRepository } from "../repositories/SchedulesRepository";

class SchedulesService {
  private schedulesRepository: SchedulesRepository;

  constructor() {
    this.schedulesRepository = new SchedulesRepository();
  }

  async create({ name, phone, date }: ICreateSchedules) {
    const dateFormatted = new Date(date);
    const hourStart = startOfHour(dateFormatted);
    if (isBefore(hourStart, new Date())) {
      throw new Error("It is not allowed to schedule old date");
    }

    const checkIsAvailable = await this.schedulesRepository.findByDate(
      hourStart
    );
    if (checkIsAvailable) {
      throw new Error("Schedule date is not available");
    }
    const create = await this.schedulesRepository.create({
      name,
      phone,
      date: hourStart,
    });
    return create;
  }

  async index(date: Date){
    const result = await this.schedulesRepository.findAll(date);
    return result;
  }

  async update(id : string, date: Date){
    const dateFormatted = new Date(date);
    const hourStart = startOfHour(dateFormatted);
    if (isBefore(hourStart, new Date())) {
      throw new Error("It is not allowed to schedule old date");
    }

    const checkIsAvailable = await this.schedulesRepository.findByDate(
      hourStart
    );
    if (checkIsAvailable) {
      throw new Error("Schedule date is not available");
    }

    const result = await this.schedulesRepository.update(id, date);
    return result;
  }
}

export { SchedulesService };
