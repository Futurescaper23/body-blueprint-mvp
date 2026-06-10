import { NextResponse } from "next/server";

type UsdaNutrient = {
  value?: number;
  amount?: number;
  nutrientName?: string;
  name?: string;
  unitName?: string;
  nutrient?: {
    name?: string;
    unitName?: string;
  };
};

type UsdaFood = {
  description?: string;
  householdServingFullText?: string;
  servingSize?: number;
  servingSizeUnit?: string;
  foodNutrients?: UsdaNutrient[];
};

function readNutrient(food: UsdaFood, names: string[]) {
  const nutrients = food.foodNutrients ?? [];
  const match = nutrients.find((item) => {
    const name = item.nutrientName ?? item.name ?? item.nutrient?.name ?? "";
    return names.some((candidate) => name.toLowerCase().includes(candidate.toLowerCase()));
  });

  return Number(match?.value ?? match?.amount ?? 0);
}

function detectUnit(food: UsdaFood) {
  if (food.servingSizeUnit) return food.servingSizeUnit.toLowerCase();
  if (food.householdServingFullText?.toLowerCase().includes("ml")) return "ml";
  return "g";
}

function detectBaseAmount(food: UsdaFood) {
  return Number(food.servingSize ?? 100) || 100;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";

  if (!query) {
    return NextResponse.json({ foods: [] });
  }

  const apiKey = process.env.USDA_FDC_API_KEY ?? "DEMO_KEY";
  const url = new URL("https://api.nal.usda.gov/fdc/v1/foods/search");
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("query", query);
  url.searchParams.set("pageSize", "8");
  url.searchParams.set("dataType", "Foundation,SR Legacy,Branded");

  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    return NextResponse.json(
      { foods: [], error: "USDA food lookup failed." },
      { status: response.status },
    );
  }

  const payload = (await response.json()) as { foods?: UsdaFood[] };
  const foods = (payload.foods ?? [])
    .filter((food) => food.description)
    .map((food, index) => ({
      id: `usda-${query.toLowerCase().replace(/\s+/g, "-")}-${index}`,
      name: food.description!,
      unitLabel: detectUnit(food),
      baseAmount: detectBaseAmount(food),
      calories: readNutrient(food, ["energy", "calories"]),
      protein: readNutrient(food, ["protein"]),
      carbs: readNutrient(food, ["carbohydrate"]),
      fat: readNutrient(food, ["total lipid", "fat"]),
      fibre: readNutrient(food, ["fiber", "fibre"]),
    }))
    .filter((food) => food.calories || food.protein || food.carbs || food.fat || food.fibre);

  return NextResponse.json({ foods });
}
