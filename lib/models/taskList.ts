export type TaskList = {
    id: number;
    user_id: number;
    name: string;
    created_at?: Date;
}

export type TaskLists = TaskList[];