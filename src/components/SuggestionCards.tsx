import React from 'react';

interface SuggestionCard {
    icon: string;
    text: string;
    payload: string;
}

interface SuggestionCardsProps {
    onCardClick: (payload: string) => void;
}

const suggestions: SuggestionCard[] = [
    {
        icon: '💪',
        text: 'პროტეინი მინდა კუნთის ზრდისთვის',
        payload: 'პროტეინი მინდა კუნთის ზრდისთვის',
    },
    {
        icon: '⚡',
        text: 'კრეატინი მინდა ძალისა და ენერგიისთვის',
        payload: 'კრეატინი მინდა ძალისა და ენერგიისთვის',
    },
    {
        icon: '💊',
        text: 'ვიტამინები მინდა ჯანმრთელობისთვის',
        payload: 'ვიტამინები მინდა ჯანმრთელობისთვის',
    },
    {
        icon: '🤔',
        text: 'მირჩიე ჩემი მიზნის მიხედვით',
        payload: 'მირჩიე ჩემი მიზნის მიხედვით',
    },
];

export const SuggestionCards: React.FC<SuggestionCardsProps> = ({ onCardClick }) => {
    return (
        <div className="suggestion-cards">
            {suggestions.map((suggestion, index) => (
                <div
                    key={index}
                    className="suggestion-card"
                    onClick={() => onCardClick(suggestion.payload)}
                >
                    <div className="suggestion-icon">{suggestion.icon}</div>
                    <div className="suggestion-text">{suggestion.text}</div>
                </div>
            ))}
        </div>
    );
};
