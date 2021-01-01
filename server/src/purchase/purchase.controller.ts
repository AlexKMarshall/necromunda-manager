import { Body, Controller, Param, Post } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { PurchaseService } from './purchase.service';

@Controller('gangs/:gangId/purchase')
export class PurchaseController {
  constructor(private purchaseService: PurchaseService) {}

  @Post()
  create(
    @Body() createPurchaseDto: CreatePurchaseDto,
    @Param('gangId') gangId: string,
  ) {
    return this.purchaseService.executePurchase(createPurchaseDto, gangId);
  }
}
