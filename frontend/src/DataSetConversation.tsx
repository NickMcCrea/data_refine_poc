import React from 'react';

// Define the FilterCriterion type
export type FilterCriterion = {
    field: string;
    value: string;
};

// Define the ConversationData type
export type ConversationData = {
    conversation_history: string[];
    current_query: string;
    data_set: {
        name: string;
    };
    filter_criteria: FilterCriterion[];
    initial_query: string;
    target_system: {
        name: string;
    };
    time_period: {
        single_date: string;
    };
};