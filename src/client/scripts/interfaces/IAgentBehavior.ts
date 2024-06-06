export enum AgentState
{
    Patrolling,
    FollowingPlayer,
    InYard
}

export interface IAgentBehavior
{
    agentState: AgentState;

    updateAgent(deltaTime: number): void;
}