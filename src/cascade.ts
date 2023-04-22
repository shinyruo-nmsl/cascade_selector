export interface Option<T> {
  value: T;
  label: string;
  children?: Option<T>[];
  disabled?: boolean;
}

export class MultiCascaderOption<T> {
  private isCheck = false;

  constructor(
    public label: string,
    public value: T,
    public children: MultiCascaderOption<T>[],
    public parent: MultiCascaderOption<T> | null,
    public disabled?: boolean
  ) {}

  get checked() {
    return this.isCheck;
  }

  set checked(val: boolean) {
    if (!this.disabled) {
      this.isCheck = val;
      this.parentEffect(this);
      this.childrenEffect(this);
    }
  }

  // 所有的叶子节点的集合
  get leaves() {
    const leaves: MultiCascaderOption<T>[] = [];
    const queue: MultiCascaderOption<T>[] = [this];
    while (queue.length) {
      const op = queue.shift();
      if (op!.children.length) {
        for (const child of op!.children) {
          queue.push(child);
        }
      } else {
        leaves.push(op!);
      }
    }
    return leaves;
  }

  // 选中的叶子节点
  get checkedLeaves(): MultiCascaderOption<T>[] {
    return this.leaves.filter((leave) => leave.isCheck);
  }

  // 初始化选择器的状态
  initStatus(values: T[]) {
    this.leaves.forEach(
      (leave) => (leave.checked = !!values.find((val) => val === leave.value))
    );
  }

  parentEffect(op: MultiCascaderOption<T>) {
    if (!op.parent) return;
    let parent = op.parent;
    const allSame = parent.children.every(
      (child) => child.checked === op.isCheck || child.disabled
    );
    if (allSame) {
      parent.isCheck = op.isCheck;
    } else {
      if (!op.isCheck) parent.isCheck = false;
    }
    this.parentEffect(parent);
  }

  childrenEffect(op: MultiCascaderOption<T>) {
    if (!op.children.length) return;
    for (const child of op.children) {
      child.checked = op.isCheck;
      this.childrenEffect(child);
    }
  }
}

export function createMultiCascaderOption<T>(
  op: Option<T>
): MultiCascaderOption<T> {
  const multiCascadeOption = new MultiCascaderOption(
    op.label,
    op.value,
    [],
    null,
    !!op.disabled
  );
  if (op.children && op.children.length) {
    const children = op.children.map(createMultiCascaderOption);
    children.forEach((child) => (child.parent = multiCascadeOption));
    multiCascadeOption.children = children;
    if (multiCascadeOption.children.every((child) => !!child.disabled))
      multiCascadeOption.disabled = true;
  }
  return multiCascadeOption;
}

export function createMultiCascader<T>(option: Option<T>, values: T[]) {
  const multiCascader = createMultiCascaderOption(option);
  multiCascader.initStatus(values);
  return multiCascader;
}
