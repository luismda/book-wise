export function calculateAverageGrade(grades: number[]) {
  if (grades.length === 0) {
    return 0
  }

  const sumOfGrades = grades.reduce((acc, grade) => acc + grade, 0)
  const gradesAmount = grades.length

  const averageGrade = sumOfGrades / gradesAmount

  return averageGrade
}
