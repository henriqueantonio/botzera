import fs from 'fs';
import path from 'path';
export class MemeRepository {
  public getMemes(): string[] {
    let files = fs.readdirSync(
      path.resolve(__dirname, '..', '..', 'assets', 'sounds'),
    );

    let stringMemes: string[] = [];

    files.forEach((item: string) => {
      let nomes = item.split('.')[0];
      stringMemes.push(nomes);
    });

    return stringMemes;
  }

  public memeExists(meme: string): boolean {
    return !!this.getMemes().find(m => m === meme);
  }
}
