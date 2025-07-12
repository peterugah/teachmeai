import { CreateReportDto } from "@shared/types";


const create = async (payload: CreateReportDto) => {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/report`, {
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST"
  })
  return response.json() as Promise<{ id: number }>
}
export const reportApi = {
  create
}