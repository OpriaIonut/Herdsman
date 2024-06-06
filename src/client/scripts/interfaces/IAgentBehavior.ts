export enum AgentState
{
    Patrolling,
    FollowingPlayer,
    InYard
}

//Base interface for defining the ai behavior for the entities in the game
export interface IAgentBehavior
{
    agentState: AgentState;

    updateAgent(deltaTime: number): void;
}