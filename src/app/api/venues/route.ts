import { NextRequest, NextResponse } from 'next/server';
import { getVenues } from '@/lib/dal/venues';
import { normalizeCityName } from '@/lib/cities';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const city = searchParams.get('city');
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : null;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : null;
    const minGuests = searchParams.get('minGuests') ? Number(searchParams.get('minGuests')) : null;
    const acType = searchParams.get('acType'); // 'all' | 'ac' | 'non-ac'
    const sortBy = searchParams.get('sortBy') || 'popular';

    let venues = await getVenues();

    // 1. Filter by category
    if (category && category !== 'all') {
      venues = venues.filter((v) => v.category === category);
    }

    // 2. Filter by city
    if (city && city.toLowerCase() !== 'all') {
      venues = venues.filter((v) => normalizeCityName(v.city) === normalizeCityName(city));
    }

    // 3. Filter by price
    if (minPrice !== null) {
      venues = venues.filter((v) => v.maxPricePerDay >= minPrice);
    }
    if (maxPrice !== null) {
      venues = venues.filter((v) => v.minPricePerDay <= maxPrice);
    }

    // 4. Filter by guest capacity
    if (minGuests !== null) {
      venues = venues.filter((v) => v.totalSeatingCapacity >= minGuests);
    }

    // 5. Filter by AC type
    if (acType === 'ac') {
      venues = venues.filter((v) => v.blocks.some((b) => b.isAirConditioned));
    } else if (acType === 'non-ac') {
      venues = venues.filter((v) => v.blocks.some((b) => !b.isAirConditioned));
    }

    // 6. Sorting
    switch (sortBy) {
      case 'price-asc':
        venues.sort((a, b) => a.minPricePerDay - b.minPricePerDay);
        break;
      case 'price-desc':
        venues.sort((a, b) => b.minPricePerDay - a.minPricePerDay);
        break;
      case 'rating':
        venues.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
      default:
        venues.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    return NextResponse.json({
      success: true,
      count: venues.length,
      data: venues,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch venues' },
      { status: 500 }
    );
  }
}
