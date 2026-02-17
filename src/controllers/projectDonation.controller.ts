import { Router } from "express";
import { createProjectDonationSchema } from "../validations/projectDonationSchema";
import { createProjectDonationService } from "../services/projectDonationService";

const router = Router();

router.post("/", async (req, res) => {
  const result = createProjectDonationSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      errors: result.error.issues.map(e => e.message)
    });
  }

  try {
    const response = await createProjectDonationService(result.data);
    res.status(201).json(response);
  } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }

      return res.status(400).json({ message: "Something went wrong" });
    }
});

export default router;
