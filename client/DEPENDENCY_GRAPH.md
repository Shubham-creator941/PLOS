# DEPENDENCY GRAPH

## Macro Architecture Flow

```mermaid
flowchart TD
    %% Define Layers
    subgraph App Layer
        A1(app/main.tsx)
        A2(app/App.tsx)
    end

    subgraph Platform Layer
        P1(providers/ThemeContext.tsx)
        R1(routes/index.tsx)
        L1(layouts/AuthLayout.tsx)
        L2(layouts/DashboardLayout.tsx)
        L3(layouts/Sidebar.tsx)
        L4(layouts/TopNavbar.tsx)
    end

    subgraph Experience Layer
        E1(Authentication)
        E2(Landing)
        E3(MissionControl)
        E4(Onboarding)
        E5(Studio)
        E6(Map)
        E7(Mirror)
        E8(EngineRoom)
    end

    subgraph Widget Layer
        W1(ActivityGraph)
        W2(TaskCard)
        W3(MilestoneCard)
        W4(PageHeader)
    end

    subgraph Primitive Layer
        B1(Button, Card, Input...)
    end

    %% Define Dependencies
    A1 --> A2
    A2 --> P1
    A2 --> R1
    
    R1 --> L1
    R1 --> L2
    
    L2 --> L3
    L2 --> L4
    
    R1 --> E1
    R1 --> E2
    R1 --> E3
    R1 --> E4
    R1 --> E5
    R1 --> E6
    R1 --> E7
    R1 --> E8

    E3 --> W1
    E3 --> W2
    E5 --> W2
    E6 --> W3
    
    W1 --> B1
    W2 --> B1
    W3 --> B1
    W4 --> B1
    
    E1 --> B1
    E2 --> B1
```

## Observations
- **No Circular Imports**: Directed Acyclic Graph (DAG) is maintained perfectly.
- **Layer Violations**: Zero. Data flows strictly downward.
- **Dependency Hotspots**: The `primitives/` folder (specifically `Card`, `Button`, and `Input`) possesses a high fan-in (imported extensively across the codebase), which is mathematically correct for a Design System foundation.
- **Fan-Out**: `routes/index.tsx` has the highest fan-out, acting correctly as the global experience orchestrator.
