"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Sparkles, Trash2 } from "lucide-react";
import { inputClass, Panel } from "@/components/ui";

type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snack";

type MacroTargets = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fibre: number;
};

type NutritionFood = {
  id: string;
  name: string;
  unitLabel: string;
  baseAmount: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fibre: number;
};

type SearchFood = NutritionFood;

type MealIngredient = {
  foodId: string;
  quantity: number;
};

type SavedMeal = {
  id: string;
  name: string;
  mealType: MealType;
  ingredients: MealIngredient[];
};

type LoggedMeal = SavedMeal & {
  loggedAt: string;
};

type MacroTotals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fibre: number;
};

const defaultTargets: MacroTargets = {
  calories: 2100,
  protein: 150,
  carbs: 220,
  fat: 65,
  fibre: 30,
};

const mealTypes: MealType[] = ["Breakfast", "Lunch", "Dinner", "Snack"];

const starterFoods: NutritionFood[] = [
  {
    id: "food-apple",
    name: "Apple",
    unitLabel: "g",
    baseAmount: 100,
    calories: 52,
    protein: 0.3,
    carbs: 14,
    fat: 0.2,
    fibre: 2.4,
  },
  {
    id: "food-granola",
    name: "Granola",
    unitLabel: "g",
    baseAmount: 100,
    calories: 471,
    protein: 10,
    carbs: 64,
    fat: 20,
    fibre: 8,
  },
  {
    id: "food-greek-yoghurt",
    name: "Greek yoghurt",
    unitLabel: "g",
    baseAmount: 100,
    calories: 97,
    protein: 9,
    carbs: 3.9,
    fat: 5,
    fibre: 0,
  },
  {
    id: "food-orange-juice",
    name: "Orange juice",
    unitLabel: "ml",
    baseAmount: 100,
    calories: 45,
    protein: 0.7,
    carbs: 10.4,
    fat: 0.2,
    fibre: 0.2,
  },
  {
    id: "food-oats",
    name: "Oats",
    unitLabel: "g",
    baseAmount: 100,
    calories: 389,
    protein: 16.9,
    carbs: 66.3,
    fat: 6.9,
    fibre: 10.6,
  },
  {
    id: "food-chicken-breast",
    name: "Chicken breast",
    unitLabel: "g",
    baseAmount: 100,
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fibre: 0,
  },
  {
    id: "food-cooked-rice",
    name: "Cooked rice",
    unitLabel: "g",
    baseAmount: 100,
    calories: 130,
    protein: 2.7,
    carbs: 28,
    fat: 0.3,
    fibre: 0.4,
  },
];

const starterMeals: SavedMeal[] = [
  {
    id: "meal-breakfast-bowl",
    name: "Breakfast granola bowl",
    mealType: "Breakfast",
    ingredients: [
      { foodId: "food-apple", quantity: 120 },
      { foodId: "food-granola", quantity: 100 },
      { foodId: "food-greek-yoghurt", quantity: 150 },
      { foodId: "food-orange-juice", quantity: 200 },
    ],
  },
  {
    id: "meal-chicken-rice",
    name: "Chicken and rice",
    mealType: "Lunch",
    ingredients: [
      { foodId: "food-chicken-breast", quantity: 180 },
      { foodId: "food-cooked-rice", quantity: 220 },
    ],
  },
];

function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function blankTotals(): MacroTotals {
  return { calories: 0, protein: 0, carbs: 0, fat: 0, fibre: 0 };
}

function formatNumber(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function formatMacroLine(totals: MacroTotals) {
  return `${Math.round(totals.calories)} kcal | ${formatNumber(totals.protein)}P | ${formatNumber(
    totals.carbs,
  )}C | ${formatNumber(totals.fat)}F | ${formatNumber(totals.fibre)} fibre`;
}

function MacroChips({ totals }: { totals: MacroTotals }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold leading-5 text-slate-200">
      <span className="rounded-full bg-white/10 px-3 py-1">{Math.round(totals.calories)} kcal</span>
      <span className="rounded-full bg-white/10 px-3 py-1">{formatNumber(totals.protein)}g protein</span>
      <span className="rounded-full bg-white/10 px-3 py-1">{formatNumber(totals.carbs)}g carbs</span>
      <span className="rounded-full bg-white/10 px-3 py-1">{formatNumber(totals.fat)}g fat</span>
      <span className="rounded-full bg-white/10 px-3 py-1">{formatNumber(totals.fibre)}g fibre</span>
    </div>
  );
}

function calculateFoodTotals(food: NutritionFood, quantity: number): MacroTotals {
  const multiplier = quantity / Math.max(food.baseAmount, 1);
  return {
    calories: food.calories * multiplier,
    protein: food.protein * multiplier,
    carbs: food.carbs * multiplier,
    fat: food.fat * multiplier,
    fibre: food.fibre * multiplier,
  };
}

function calculateMealTotals(meal: SavedMeal | LoggedMeal, foods: NutritionFood[]): MacroTotals {
  return meal.ingredients.reduce((totals, ingredient) => {
    const food = foods.find((item) => item.id === ingredient.foodId);
    if (!food) return totals;
    const itemTotals = calculateFoodTotals(food, ingredient.quantity);
    return {
      calories: totals.calories + itemTotals.calories,
      protein: totals.protein + itemTotals.protein,
      carbs: totals.carbs + itemTotals.carbs,
      fat: totals.fat + itemTotals.fat,
      fibre: totals.fibre + itemTotals.fibre,
    };
  }, blankTotals());
}

function loadTargets() {
  const saved = localStorage.getItem("bb_nutrition_targets");
  if (!saved) return defaultTargets;
  return { ...defaultTargets, ...(JSON.parse(saved) as Partial<MacroTargets>) };
}

function loadFoods() {
  const saved = localStorage.getItem("bb_nutrition_foods");
  if (!saved) return starterFoods;
  const parsed = JSON.parse(saved) as NutritionFood[];
  const missingStarters = starterFoods.filter((food) => !parsed.some((item) => item.id === food.id));
  return [...missingStarters, ...parsed];
}

function loadMeals() {
  const saved = localStorage.getItem("bb_nutrition_meals");
  if (!saved) return starterMeals;
  const parsed = JSON.parse(saved) as SavedMeal[];
  const missingStarters = starterMeals.filter((meal) => !parsed.some((item) => item.id === meal.id));
  return [...missingStarters, ...parsed];
}

function loadTodayMeals() {
  const saved = localStorage.getItem(`bb_nutrition_log:${todayKey()}`);
  if (!saved) return [] as LoggedMeal[];
  return JSON.parse(saved) as LoggedMeal[];
}

function ProgressBar({
  label,
  current,
  target,
  suffix,
  tone,
}: {
  label: string;
  current: number;
  target: number;
  suffix: string;
  tone: string;
}) {
  const progress = Math.max(0, Math.min(100, (current / Math.max(target, 1)) * 100));

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="text-xs font-semibold text-slate-300">
          {formatNumber(current)}
          {suffix} / {Math.round(target)}
          {suffix}
        </p>
      </div>
      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

export function NutritionTracker() {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [targets, setTargets] = useState<MacroTargets>(defaultTargets);
  const [foods, setFoods] = useState<NutritionFood[]>(starterFoods);
  const [savedMeals, setSavedMeals] = useState<SavedMeal[]>(starterMeals);
  const [todayMeals, setTodayMeals] = useState<LoggedMeal[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchFood[]>([]);
  const [searchError, setSearchError] = useState("");
  const [searching, setSearching] = useState(false);
  const [foodForm, setFoodForm] = useState({
    name: "",
    unitLabel: "g",
    baseAmount: "100",
    calories: "52",
    protein: "0.3",
    carbs: "14",
    fat: "0.2",
    fibre: "2.4",
  });
  const [mealName, setMealName] = useState("");
  const [mealType, setMealType] = useState<MealType>("Breakfast");
  const [selectedFoodId, setSelectedFoodId] = useState(starterFoods[0]?.id ?? "");
  const [quantity, setQuantity] = useState("100");
  const [mealIngredients, setMealIngredients] = useState<MealIngredient[]>([]);

  const todayTotals = useMemo(
    () =>
      todayMeals.reduce((totals, meal) => {
        const mealTotals = calculateMealTotals(meal, foods);
        return {
          calories: totals.calories + mealTotals.calories,
          protein: totals.protein + mealTotals.protein,
          carbs: totals.carbs + mealTotals.carbs,
          fat: totals.fat + mealTotals.fat,
          fibre: totals.fibre + mealTotals.fibre,
        };
      }, blankTotals()),
    [foods, todayMeals],
  );

  const builderMeal = useMemo<SavedMeal>(
    () => ({
      id: "builder-preview",
      name: mealName || "Untitled meal",
      mealType,
      ingredients: mealIngredients,
    }),
    [mealIngredients, mealName, mealType],
  );

  const builderTotals = useMemo(
    () => calculateMealTotals(builderMeal, foods),
    [builderMeal, foods],
  );

  const orderedTodayMeals = useMemo(
    () =>
      [...todayMeals].sort((a, b) => {
        const order = mealTypes.indexOf(a.mealType) - mealTypes.indexOf(b.mealType);
        return order || a.loggedAt.localeCompare(b.loggedAt);
      }),
    [todayMeals],
  );

  useEffect(() => {
    setTargets(loadTargets());
    setFoods(loadFoods());
    setSavedMeals(loadMeals());
    setTodayMeals(loadTodayMeals());
    setHasLoaded(true);
  }, []);

  function saveTargets(next: MacroTargets) {
    setTargets(next);
    localStorage.setItem("bb_nutrition_targets", JSON.stringify(next));
  }

  function saveFoods(next: NutritionFood[]) {
    setFoods(next);
    localStorage.setItem("bb_nutrition_foods", JSON.stringify(next));
  }

  function saveMeals(next: SavedMeal[]) {
    setSavedMeals(next);
    localStorage.setItem("bb_nutrition_meals", JSON.stringify(next));
  }

  function saveToday(next: LoggedMeal[]) {
    setTodayMeals(next);
    localStorage.setItem(`bb_nutrition_log:${todayKey()}`, JSON.stringify(next));
  }

  async function searchFoods() {
    const query = searchQuery.trim();
    if (!query) return;

    setSearching(true);
    setSearchError("");

    try {
      const response = await fetch(`/api/nutrition/foods?q=${encodeURIComponent(query)}`);
      const payload = (await response.json()) as { foods?: SearchFood[]; error?: string };

      if (!response.ok) {
        setSearchResults([]);
        setSearchError(payload.error ?? "Food lookup failed.");
        return;
      }

      setSearchResults(payload.foods ?? []);
      if (!(payload.foods ?? []).length) {
        setSearchError("No foods found for that search.");
      }
    } catch {
      setSearchResults([]);
      setSearchError("Food lookup failed.");
    } finally {
      setSearching(false);
    }
  }

  function createFood() {
    const name = foodForm.name.trim();
    if (!name) return;

    const food: NutritionFood = {
      id: crypto.randomUUID(),
      name,
      unitLabel: foodForm.unitLabel.trim() || "g",
      baseAmount: Number(foodForm.baseAmount) || 100,
      calories: Number(foodForm.calories) || 0,
      protein: Number(foodForm.protein) || 0,
      carbs: Number(foodForm.carbs) || 0,
      fat: Number(foodForm.fat) || 0,
      fibre: Number(foodForm.fibre) || 0,
    };

    saveFoods([food, ...foods]);
    setSelectedFoodId(food.id);
    setFoodForm({
      ...foodForm,
      name: "",
    });
  }

  function importFood(food: SearchFood) {
    const existing = foods.find((item) => item.name.toLowerCase() === food.name.toLowerCase());
    if (existing) {
      setSelectedFoodId(existing.id);
      return;
    }

    const nextFood = {
      ...food,
      id: crypto.randomUUID(),
    };

    saveFoods([nextFood, ...foods]);
    setSelectedFoodId(nextFood.id);
  }

  function addIngredient() {
    if (!selectedFoodId) return;
    const amount = Number(quantity);
    if (!amount) return;

    setMealIngredients([...mealIngredients, { foodId: selectedFoodId, quantity: amount }]);
    setQuantity("100");
  }

  function removeIngredient(index: number) {
    setMealIngredients(mealIngredients.filter((_, itemIndex) => itemIndex !== index));
  }

  function saveMeal(addToToday: boolean) {
    const name = mealName.trim();
    if (!name || !mealIngredients.length) return;

    const meal: SavedMeal = {
      id: crypto.randomUUID(),
      name,
      mealType,
      ingredients: mealIngredients,
    };

    saveMeals([meal, ...savedMeals]);

    if (addToToday) {
      saveToday([
        {
          ...meal,
          id: crypto.randomUUID(),
          loggedAt: new Date().toISOString(),
        },
        ...todayMeals,
      ]);
    }

    setMealName("");
    setMealType("Breakfast");
    setMealIngredients([]);
  }

  function addSavedMealToToday(meal: SavedMeal) {
    saveToday([
      {
        ...meal,
        id: crypto.randomUUID(),
        loggedAt: new Date().toISOString(),
      },
      ...todayMeals,
    ]);
  }

  function removeFood(id: string) {
    saveFoods(foods.filter((food) => food.id !== id));
    setMealIngredients(mealIngredients.filter((ingredient) => ingredient.foodId !== id));
  }

  function removeSavedMeal(id: string) {
    saveMeals(savedMeals.filter((meal) => meal.id !== id));
  }

  function removeLoggedMeal(id: string) {
    saveToday(todayMeals.filter((meal) => meal.id !== id));
  }

  const caloriesLeft = Math.max(targets.calories - todayTotals.calories, 0);
  const proteinLeft = Math.max(targets.protein - todayTotals.protein, 0);

  return (
    <div className="grid min-w-0 gap-4 overflow-x-hidden">
      <section className="min-w-0 overflow-hidden rounded-[1.5rem] border border-emerald-300/15 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.28),_transparent_35%),linear-gradient(160deg,#10211b_0%,#101720_55%,#0b0f14_100%)] p-4 shadow-xl shadow-black/30 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">Today&apos;s nutrition</p>
            <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Build meals from foods</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-200">
              Save foods once, set the grams or millilitres you used, and let the app calculate the meal totals for you.
            </p>
          </div>
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-300/20 text-emerald-100">
            <Sparkles className="h-7 w-7" aria-hidden />
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-black/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">Calories left</p>
            <p className="mt-2 text-3xl font-semibold text-white">{Math.round(caloriesLeft)}</p>
          </div>
          <div className="rounded-2xl bg-black/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">Protein left</p>
            <p className="mt-2 text-3xl font-semibold text-white">{Math.round(proteinLeft)}g</p>
          </div>
          <div className="rounded-2xl bg-black/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">Meals logged</p>
            <p className="mt-2 text-3xl font-semibold text-white">{todayMeals.length}</p>
          </div>
        </div>
      </section>

      <Panel className="min-w-0 p-5">
        <h2 className="text-lg font-semibold text-white">Daily targets</h2>
        <p className="mt-1 text-sm leading-6 text-slate-400">Set the numbers you want to aim for each day.</p>
        <div className="mt-4 grid gap-3">
          {(
            [
              ["calories", "Calories"],
              ["protein", "Protein"],
              ["carbs", "Carbs"],
              ["fat", "Fat"],
              ["fibre", "Fibre"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="grid gap-2 text-sm font-semibold text-slate-200">
              {label}
              <input
                className={inputClass}
                type="number"
                min="0"
                value={targets[key]}
                onChange={(event) =>
                  saveTargets({
                    ...targets,
                    [key]: Number(event.target.value) || 0,
                  })
                }
              />
            </label>
          ))}
        </div>
      </Panel>

      <div className="grid min-w-0 gap-4">
        <Panel className="min-w-0 p-5">
          <h2 className="text-lg font-semibold text-white">Create a food</h2>
          <p className="mt-1 text-sm leading-6 text-slate-400">
            Add a food once with nutrition per base amount, then reuse it in any meal you build.
          </p>
          <div className="mt-4 grid gap-3">
            <div className="rounded-2xl border border-sky-300/15 bg-sky-300/10 p-4">
              <h3 className="text-sm font-semibold text-sky-100">Import from USDA</h3>
              <p className="mt-1 text-sm leading-6 text-sky-50/85">
                Search the USDA food database, then pull the result straight into your saved foods.
              </p>
              <div className="mt-3 grid gap-3">
                <input
                  className={inputClass}
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search apple, granola, yoghurt, rice"
                />
                <button
                  type="button"
                  onClick={searchFoods}
                  className="min-h-12 rounded-lg bg-sky-300 px-5 text-sm font-bold text-slate-950 transition hover:bg-sky-200"
                >
                  {searching ? "Searching..." : "Search foods"}
                </button>
              </div>
              {searchError ? <p className="mt-3 text-sm text-sky-50/85">{searchError}</p> : null}
              {searchResults.length ? (
                <div className="mt-4 grid gap-3">
                  {searchResults.map((food) => (
                    <div key={food.id} className="rounded-2xl border border-white/10 bg-black/15 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h4 className="break-words text-base font-semibold text-white">{food.name}</h4>
                          <p className="mt-1 text-sm text-slate-300">
                            Per {food.baseAmount}
                            {food.unitLabel}
                          </p>
                          <MacroChips totals={food} />
                        </div>
                        <button
                          type="button"
                          onClick={() => importFood(food)}
                          className="shrink-0 min-h-10 rounded-lg bg-white/10 px-3 text-sm font-semibold text-white transition hover:bg-white/15"
                        >
                          Import
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            <label className="grid gap-2 text-sm font-semibold text-slate-200">
              Food name
              <input
                className={inputClass}
                value={foodForm.name}
                onChange={(event) => setFoodForm({ ...foodForm, name: event.target.value })}
                placeholder="e.g. Peanut butter"
              />
            </label>
            <div className="grid gap-3">
              <label className="grid gap-2 text-sm font-semibold text-slate-200">
                Base amount
                <input
                  className={inputClass}
                  type="number"
                  min="1"
                  value={foodForm.baseAmount}
                  onChange={(event) => setFoodForm({ ...foodForm, baseAmount: event.target.value })}
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-200">
                Unit
                <input
                  className={inputClass}
                  value={foodForm.unitLabel}
                  onChange={(event) => setFoodForm({ ...foodForm, unitLabel: event.target.value })}
                  placeholder="g or ml"
                />
              </label>
            </div>
            <div className="grid gap-3">
              {(
                [
                  ["calories", "Calories"],
                  ["protein", "Protein"],
                  ["carbs", "Carbs"],
                  ["fat", "Fat"],
                  ["fibre", "Fibre"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="grid gap-2 text-sm font-semibold text-slate-200">
                  {label}
                  <input
                    className={inputClass}
                    type="number"
                    min="0"
                    step="0.1"
                    value={foodForm[key]}
                    onChange={(event) => setFoodForm({ ...foodForm, [key]: event.target.value })}
                  />
                </label>
              ))}
            </div>
            <button
              type="button"
              onClick={createFood}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-emerald-300 px-5 text-sm font-bold text-slate-950 transition hover:bg-emerald-200"
            >
              <Plus className="h-4 w-4" aria-hidden />
              Save food
            </button>
          </div>
        </Panel>

        <Panel className="min-w-0 p-5">
          <h2 className="text-lg font-semibold text-white">Build a meal</h2>
          <p className="mt-1 text-sm leading-6 text-slate-400">
            Pick foods, enter how much you used, and the meal totals update automatically.
          </p>
          <div className="mt-4 grid gap-3">
            <div className="grid gap-3">
              <label className="grid gap-2 text-sm font-semibold text-slate-200">
                Meal name
                <input
                  className={inputClass}
                  value={mealName}
                  onChange={(event) => setMealName(event.target.value)}
                  placeholder="e.g. Apple granola bowl"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-200">
                Meal slot
                <select
                  className={inputClass}
                  value={mealType}
                  onChange={(event) => setMealType(event.target.value as MealType)}
                >
                  {mealTypes.map((item) => (
                    <option className="bg-slate-950" key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="grid gap-3">
              <label className="grid gap-2 text-sm font-semibold text-slate-200">
                Food
                <select
                  className={inputClass}
                  value={selectedFoodId}
                  onChange={(event) => setSelectedFoodId(event.target.value)}
                >
                  {foods.map((food) => (
                    <option className="bg-slate-950" key={food.id} value={food.id}>
                      {food.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-200">
                Quantity
                <input
                  className={inputClass}
                  type="number"
                  min="1"
                  step="1"
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                />
              </label>
              <button
                type="button"
                onClick={addIngredient}
                className="min-h-12 rounded-lg bg-white/[0.08] px-4 text-sm font-bold text-white transition hover:bg-white/12"
              >
                Add
              </button>
            </div>
            <div className="rounded-2xl border border-sky-300/15 bg-sky-300/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-200">Meal total</p>
              {hasLoaded ? <MacroChips totals={builderTotals} /> : null}
            </div>
            <div className="grid gap-3">
              {mealIngredients.length ? (
                mealIngredients.map((ingredient, index) => {
                  const food = foods.find((item) => item.id === ingredient.foodId);
                  if (!food) return null;
                  const itemTotals = calculateFoodTotals(food, ingredient.quantity);
                  return (
                    <div key={`${ingredient.foodId}-${index}`} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="break-words text-base font-semibold text-white">{food.name}</h3>
                          <p className="mt-1 text-sm text-slate-400">
                            {ingredient.quantity}
                            {food.unitLabel} used
                          </p>
                          <MacroChips totals={itemTotals} />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeIngredient(index)}
                          className="grid h-10 w-10 place-items-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white"
                          aria-label={`Remove ${food.name}`}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.04] p-5 text-sm leading-6 text-slate-400">
                  Add foods to this meal to see the totals build automatically.
                </div>
              )}
            </div>
            <div className="grid gap-3">
              <button
                type="button"
                onClick={() => saveMeal(true)}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-emerald-300 px-5 text-sm font-bold text-slate-950 transition hover:bg-emerald-200"
              >
                <Plus className="h-4 w-4" aria-hidden />
                Save meal and add today
              </button>
              <button
                type="button"
                onClick={() => saveMeal(false)}
                className="min-h-12 rounded-lg border border-white/10 bg-white/[0.06] px-5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Save meal only
              </button>
            </div>
          </div>
        </Panel>
      </div>

      <Panel className="min-w-0 p-5">
        <h2 className="text-lg font-semibold text-white">Today&apos;s progress</h2>
        <div className="mt-4 grid gap-3">
          <ProgressBar label="Calories" current={todayTotals.calories} target={targets.calories} suffix="" tone="bg-emerald-300" />
          <ProgressBar label="Protein" current={todayTotals.protein} target={targets.protein} suffix="g" tone="bg-sky-300" />
          <ProgressBar label="Carbs" current={todayTotals.carbs} target={targets.carbs} suffix="g" tone="bg-amber-300" />
          <ProgressBar label="Fat" current={todayTotals.fat} target={targets.fat} suffix="g" tone="bg-rose-300" />
          <ProgressBar label="Fibre" current={todayTotals.fibre} target={targets.fibre} suffix="g" tone="bg-violet-300" />
        </div>
      </Panel>

      <div className="grid min-w-0 gap-4">
        <Panel className="min-w-0 p-5">
          <h2 className="text-lg font-semibold text-white">Saved foods</h2>
          <p className="mt-1 text-sm leading-6 text-slate-400">Your building blocks for future meals.</p>
          <div className="mt-4 grid gap-3">
            {foods.map((food) => (
              <div key={food.id} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="break-words text-base font-semibold text-white">{food.name}</h3>
                    <p className="mt-1 text-sm text-slate-400">
                      Per {food.baseAmount}
                      {food.unitLabel}
                    </p>
                    {hasLoaded ? <MacroChips totals={food} /> : null}
                  </div>
                  {!starterFoods.some((starter) => starter.id === food.id) ? (
                    <button
                      type="button"
                      onClick={() => removeFood(food.id)}
                      className="grid h-10 w-10 place-items-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white"
                      aria-label={`Delete ${food.name}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="min-w-0 p-5">
          <h2 className="text-lg font-semibold text-white">Saved meals</h2>
          <p className="mt-1 text-sm leading-6 text-slate-400">Tap any saved meal to drop it into today.</p>
          <div className="mt-4 grid gap-3">
            {savedMeals.map((meal) => {
              const totals = calculateMealTotals(meal, foods);
              return (
                <div key={meal.id} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">{meal.mealType}</p>
                      <h3 className="mt-1 break-words text-lg font-semibold text-white">{meal.name}</h3>
                      {hasLoaded ? <MacroChips totals={totals} /> : null}
                      <p className="mt-2 text-xs text-slate-500">{meal.ingredients.length} foods</p>
                    </div>
                    {!starterMeals.some((starter) => starter.id === meal.id) ? (
                      <button
                        type="button"
                        onClick={() => removeSavedMeal(meal.id)}
                        className="grid h-10 w-10 place-items-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white"
                        aria-label={`Delete ${meal.name}`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => addSavedMealToToday(meal)}
                    className="mt-4 min-h-11 w-full rounded-lg border border-white/10 bg-white/[0.06] px-4 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Add to today
                  </button>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel className="min-w-0 p-5">
          <h2 className="text-lg font-semibold text-white">Today&apos;s meals</h2>
          <p className="mt-1 text-sm leading-6 text-slate-400">Everything you have logged today.</p>
          <div className="mt-4 grid gap-3">
            {orderedTodayMeals.length ? (
              orderedTodayMeals.map((meal) => {
                const totals = calculateMealTotals(meal, foods);
              return (
                  <div key={meal.id} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-200">{meal.mealType}</p>
                        <h3 className="mt-1 break-words text-lg font-semibold text-white">{meal.name}</h3>
                        {hasLoaded ? <MacroChips totals={totals} /> : null}
                        <p className="mt-2 text-xs text-slate-500">{meal.ingredients.length} foods</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeLoggedMeal(meal.id)}
                        className="grid h-10 w-10 place-items-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white"
                        aria-label={`Remove ${meal.name}`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.04] p-5 text-sm leading-6 text-slate-400">
                Nothing logged yet today. Build a meal above or add one from your saved meals.
              </div>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}
