import { Injectable } from '@nestjs/common';

@Injectable()
export class AddressService {
  async getFormattedAddress(address: string) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      return null;
    }

    return { formatted_address: data.results[0].formatted_address };
  }
}
