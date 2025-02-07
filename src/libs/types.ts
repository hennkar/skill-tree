import { Node } from 'reactflow';

export interface SkillTreeNode extends Node {
  data: {
    label: string;
    description?: string;
    level?: number;
  };
}

export type NodeProps = {
  id: string;
  data: {
    label: string;
    // description: string;
  };
  position: { x: number; y: number };
};

export type EdgeProps = {
  id: string;
  source: string;
  target: string;
  type: string;
};
