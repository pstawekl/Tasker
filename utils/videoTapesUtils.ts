export const AgeLimits: string[] = ['G','PG','PG-13','R','NC-17','UNRATED'];

export const VideoGenres: {id: number, name: string}[] = [
    {
        id: 1,
        name: 'Akcja'
    },
    {
        id: 2,
        name: 'Animacja'
    },
    {
        id: 3,
        name: 'Anime'
    },
    {
        id: 4,
        name: 'Biograficzny'
    },
    {
        id: 5,
        name: 'Dla dzieci'
    },
    {
        id: 6,
        name: 'Dokumentalny'
    },
    {
        id: 7,
        name: 'Dramat'
    },
    {
        id: 8,
        name: 'Erotyczny'
    },
    {
        id: 9,
        name: 'Familijny'
    },
    {
        id: 10,
        name: 'Fantasy'
    },
    {
        id: 11,
        name: 'Gangsterski'
    },
    {
        id: 12,
        name: 'Historyczny'
    },
    {
        id: 13,
        name: 'Horror'
    },
    {
        id: 14,
        name: 'Katastroficzny'
    },
    {
        id: 15,
        name: 'Komedia'
    },
    {
        id: 16,
        name: 'Kryminał'
    },
    {
        id: 17,
        name: 'Melodramat'
    },
    {
        id: 18,
        name: 'Musical'
    },
    {
        id: 19,
        name: 'Niemy'
    },
    {
        id: 20,
        name: 'Obyczajowy'
    },
    {
        id: 21,
        name: 'Polityczny'
    },
    {
        id: 22,
        name: 'Propagandowy'
    },
    {
        id: 23,
        name: 'Przygodowy'
    },
    {
        id: 24,
        name: 'Przyrodniczy'
    },
    {
        id: 25,
        name: 'Psychologiczny'
    },
    {
        id: 26,
        name: 'Religijny'
    },
    {
        id: 27,
        name: 'Romans'
    },
    {
        id: 28,
        name: 'Sci-Fi'
    },
    {
        id: 29,
        name: 'Sensacyjny'
    },
    {
        id: 30,
        name: 'Sportowy'
    },
    {
        id: 31,
        name: 'Sztuki walki'
    },
    {
        id: 32,
        name: 'Świąteczny'
    },
    {
        id: 33,
        name: 'Thriller'
    },
    {
        id: 34,
        name: 'Western'
    },
    {
        id: 35,
        name: 'Wojenny'
    }
]

export type VideoTape = {
    vt_id: number;
    vt_name: string;
    vt_year: number;
    vt_director: string;
    vt_format: string;
    vt_length: string;
    vt_description: string;
    vt_age_limits: string;
    vt_genre_id: number;
    gn_name: string;
}