import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

export const applyMonthYearFilter = <T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  month?: number | null,
  year?: number | null,
  alias: string = 'payment',
) => {
  if (month && year) {
    qb.andWhere(`EXTRACT(MONTH FROM ${alias}.paymentDate) = :month`, { month }).andWhere(
      `EXTRACT(YEAR FROM ${alias}.paymentDate) = :year`,
      { year },
    );
  }

  return qb;
};
