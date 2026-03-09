import { Module } from '@nestjs/common';
import { ComparisonsService } from './comparisons.service';
import { ComparisonsController } from './comparisons.controller';
import { AiModule } from '../ai/ai.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [AiModule, ProductsModule],
  controllers: [ComparisonsController],
  providers: [ComparisonsService],
})
export class ComparisonsModule {}
