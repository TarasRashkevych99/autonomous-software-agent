import Agent from './Agent.js';

class ParcelsOnMap extends Map {
    constructor() {
        super();
    }

    addParcel(parcel) {
        this.set(parcel.id, parcel);
    }
    removeParcel(parcel) {
        this.delete(parcel.id);
    }
    setParcel(parcel) {
        this.set(parcel.id, parcel);
    }
    getParcel(parcel) {
        return this.get(parcel.id);
    }
    addParcels(parcels) {
        for (const p of parcels) {
            this.addParcel(p);
        }
    }
    nearestParcel(you, parcels, nearestParcel) {
        let nearestDistance = nearestParcel;
        for (const p of parcels) {
            const distance = Math.abs(p.x - you.x) + Math.abs(p.y - you.y);
            if (distance < nearestDistance) {
                var nearest = {
                    x: p.x,
                    y: p.y,
                    carriedBy: p.carriedBy,
                    reward: p.reward,
                    distance: distance,
                };
            }
        }
        return nearest;
    }
    parcelsHistory(startTimeStamp, parcels) {
        for (const p of parcels) {
            //se non esiste la chiave p.id la creo
            if (!this.has(p.id)) {
                this.set(p.id, []);
            }
            //prendo la lista di coordinate del pacco con id p.id
            const history = this.get(p.id);
            //prendo l'ultimo elemento della lista
            const last = history[history.length - 1];
            //l'if controlla se l'ultimo elemento è uguale a quello attuale e se non lo è lo aggiunge
            if (!last || last.x != p.x || last.y != p.y) {
                history.push({ x: p.x, y: p.y });
            }

            // console.log(
            //     p.id +
            //         ':' +
            //         history
            //             .map(
            //                 (p) =>
            //                     ' @' +
            //                     (Date.now() - startTimeStamp) +
            //                     ':' +
            //                     p.x +
            //                     '' +
            //                     p.y
            //             )
            //             .join(' ')
            // );
        }
        //stampo la lista di parcels con le coordinate e lo score
    }
    getDirectionToParcel(you, parcel) {
        let direction = '';
        if (you.x < parcel.x) {
            direction = 'right';
        } else if (you.x > parcel.x) {
            direction = 'left';
        } else if (you.y < parcel.y) {
            direction = 'down';
        } else if (you.y > parcel.y) {
            direction = 'up';
        }
        return direction;
    }
}

export default ParcelsOnMap;
