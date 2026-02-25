import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/get-user.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart.dto';

@UseGuards(AuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({ summary: 'Add item to cart' })
  @Post('items')
  addItem(@Body() dto: AddToCartDto, @CurrentUser('id') id: string) {
    return this.cartService.addItem(id, dto);
  }

  @ApiOperation({ summary: 'Update item quantity' })
  @Patch('items/:id')
  updateItem(
    @Param('id') cartItemId: string,
    @Body() dto: UpdateCartItemDto,
    @CurrentUser('id') id: string
  ) {
    return this.cartService.updateItemQuantity(id, cartItemId, dto.quantity);
  }

  @ApiOperation({ summary: 'Get cart' })
  @Get()
  getCart(@CurrentUser('id') id: string) {
    return this.cartService.getCart(id);
  }

  @ApiOperation({ summary: 'Remove item from cart' })
  @Delete('items/:id')
  removeItem(@CurrentUser('id') id: string, @Param('id') cartItemId: string) {
    return this.cartService.removeItem(id, cartItemId);
  }

  @ApiOperation({ summary: 'Clear cart' })
  @Delete('clear')
  clearCart(@CurrentUser('id') id: string) {
    return this.cartService.clearCart(id);
  }
}
