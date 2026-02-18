import { Request, Response, Router } from 'express';
import {
  createPaymentService,
  getDonorPaymentsService,
  getPaymentsService,
  getPaymentSummaryService,
} from '../services/payment.service';
import { ParsedQs } from 'qs';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    await createPaymentService(req.body);

    return res.status(201).json({
      message: 'Payment created successfully',
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(400).json({ message: 'Something went wrong' });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const data = await getPaymentsService(req.query);

    return res.status(200).json({
      data,
      message: 'Payments fetched successfully',
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/summary', async (req: Request, res: Response) => {
  try {
    const query = req.query as ParsedQs;

    const data = await getPaymentSummaryService({
      month: query.month as string | number,
      year: query.year as string | number,
    });

    return res.status(200).json({
      data,
      message: 'Payment summary fetched successfully',
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/donors/:donorId', async (req: Request, res: Response) => {
  try {
    const donorId = req.params.donorId as string;

    const data = await getDonorPaymentsService(donorId, req.query);

    return res.status(200).json({
      data,
      message: 'Payments fetched successfully',
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
