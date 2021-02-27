import { Request, Response } from "express";
import { getCustomRepository, IsNull, Not } from "typeorm";
import { SurveyUserRepository } from "../repositories/SurveyUserRepository";

class NpsController {
  async execute(req: Request, res: Response) {
    const { survey_id } = req.params;

    const surveysUsersRepository = getCustomRepository(SurveyUserRepository);

    const surveysUsers = await surveysUsersRepository.find({
      survey_id,
      value: Not(IsNull()),
    });

    const detrator = surveysUsers.filter(
      (surveys) => surveys.value >= 0 && surveys.value <= 6
    ).length;

    const passive = surveysUsers.filter(
      (surveys) => surveys.value >= 7 && surveys.value <= 8
    ).length;

    const promotors = surveysUsers.filter(
      (surveys) => surveys.value >= 9 && surveys.value <= 10
    ).length;

    const totalAnswer = surveysUsers.length;

    const calculate = Number(
      (((promotors - detrator) / totalAnswer) * 100).toFixed(2)
    );

    return res.json({
      detrator,
      passive,
      promotors,
      totalAnswer,
      nps: calculate,
    });
  }
}

export { NpsController };
