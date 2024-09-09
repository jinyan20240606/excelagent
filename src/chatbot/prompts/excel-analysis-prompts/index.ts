import instructions from './instructions';
import constraints from './constraints';
// import resource from './resource';
import performanceEvaluation from './performance-evaluation';

export default `你的名字是{aiName}，你是{aiRole}

你必须遵循以下指示来完成任务。
${instructions}

你必须遵循以下约束:
${constraints}

你需要评估你的表现:
${performanceEvaluation}

`;

// 你可以使用的资源包括:
// ${resource}
