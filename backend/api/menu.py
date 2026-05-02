from fastapi import APIRouter

from data.coffee_menu import COFFEE_MENU
from models.schemas import MenuItemResponse

router = APIRouter(prefix="/api/menu", tags=["menu"])


@router.get("", response_model=list[MenuItemResponse])
async def get_menu() -> list[MenuItemResponse]:
    return [MenuItemResponse(**item) for item in COFFEE_MENU]
