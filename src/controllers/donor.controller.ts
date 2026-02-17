import { Request, Response, Router } from "express";
import { getMemberCountService } from "../services/donor.service"
import { getSubscriptionId } from "../services/subscriptions.service";

const router = Router();

router.get('/:donorId/subscription', async (
  req: Request,
  res: Response
) => {
  try {
    const donorId = req.params.donorId as string;

    const data = await getSubscriptionId(donorId)
    return res.status(200).json({
      subscriptionId: data,
      message: "Subscription fetched successfully"
    });

  } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }

      return res.status(500).json({ message: "Internal server error" });
    }
} )


router.get("/:donorId/member-count", async (req: Request, res: Response) => {
  try {
    
    const donorId = req.params.donorId as string;
    const result = await getMemberCountService(donorId);

    return res.status(200).json({
      data: {
        results: result
      },
      message: "Member count fetched successfully"
    });

  } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }

      return res.status(400).json({ message: "Something went wrong" });
    }
});

export default router;
