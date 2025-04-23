// 配置基础的增删查改

// 假API接口
const mockApi: (params: any) => Promise<any> = async (params: any) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ code: 200, data: {} });
    }, 1000);
  });
};

export const createTargetName = async (params: any, callback?: () => VideoDecoder) => {
  try {
    await mockApi(params);
    callback?.();
  } catch (error) {}
};

// 删除
export const removeTargetName = async (ids: any[], callback?: () => VideoDecoder) => {
  try {
    await mockApi(ids);
    callback?.();
  } catch (error) {}
};

// 查询
export const queryTargetName = async (params: any) => {
  try {
    const { data } = await mockApi(params);
    const { records, total } = data || {};
    return {
      records,
      total,
    };
  } catch (error) {
    return {
      records: [],
      total: 0,
    };
  }
};

// 更新
export const updateTargetName = async (params: any, callback?: () => VideoDecoder) => {
  try {
    await mockApi(params);
    callback?.();
  } catch (error) {}
};
