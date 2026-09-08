import { Router } from 'express';

const router = Router();

const fallbackReply = (message) => {
  const text = message.toLowerCase();

  if (
    text.includes('上传') ||
    text.includes('作品') ||
    text.includes('发布')
  ) {
    return '你可以通过作品上传功能提交3D作品。上传后作品会进入审核流程，审核通过后才会展示在作品展览区域。';
  }

  if (
    text.includes('审核') ||
    text.includes('管理员')
  ) {
    return '管理员可以在后台查看用户提交的作品，并进行审核。作品审核通过后，普通用户才能在展览页面中查看。';
  }

  if (
    text.includes('3d') ||
    text.includes('虚拟展览') ||
    text.includes('展览')
  ) {
    return '这是一个基于Web 3D技术构建的虚拟展览平台，用户可以浏览3D作品，并通过交互方式了解展览内容。';
  }

  if (
    text.includes('登录') ||
    text.includes('注册')
  ) {
    return '用户需要先注册并登录账号，登录后可以上传作品、查看个人中心以及管理自己的作品。';
  }

  return '我是3D虚拟展览助手。目前AI服务暂时不可用，不过你可以询问我有关作品上传、作品审核、3D虚拟展览、用户登录注册等问题。';
};

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body || {};

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: '请输入问题',
      });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return res.json({
        reply: fallbackReply(message),
        fallback: true,
      });
    }

    try {
      const response = await fetch(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: process.env.OPENROUTER_MODEL || 'openrouter/free',
            messages: [
              {
                role: 'system',
                content:
                  '你是一个专业的3D虚拟展览助手，负责帮助用户了解展览、作品和艺术信息。回答要准确、友好、简洁，不要编造不存在的信息。如果无法确定，请明确告诉用户。',
              },
              {
                role: 'user',
                content: message,
              },
            ],
          }),
        }
      );

      const responseText = await response.text();

      let data = null;

      try {
        data = responseText ? JSON.parse(responseText) : null;
      } catch {
        data = null;
      }

      if (!response.ok) {
        console.error(
          '[OpenRouter Error]',
          response.status,
          data || responseText
        );

        return res.json({
          reply: fallbackReply(message),
          fallback: true,
        });
      }

      const reply = data?.choices?.[0]?.message?.content;

      if (!reply) {
        console.warn('[OpenRouter Warning] AI没有返回有效内容');

        return res.json({
          reply: fallbackReply(message),
          fallback: true,
        });
      }

      return res.json({
        reply,
        fallback: false,
      });
    } catch (aiError) {
      console.error('[OpenRouter Request Error]', aiError);

      return res.json({
        reply: fallbackReply(message),
        fallback: true,
      });
    }
  } catch (error) {
    console.error('[AI Route Error]', error);

    return res.json({
      reply: fallbackReply(req.body?.message || ''),
      fallback: true,
    });
  }
});

export default router;