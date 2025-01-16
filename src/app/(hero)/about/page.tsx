import { Metadata } from "next";
// import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

export const metadata: Metadata = {
  description: "关于我 - 曹光耀",
  title: "关于我",
};

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8  rounded-lg shadow-md p-6">
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-2">求职意向</h2>
          <p>工作性质：全职/兼职</p>
          <p>目标职能：前端技术经理、前端架构、高级前端开发、全栈开发</p>
          <p>可以承接：站点、小程序、H5、移动端等开发。前端技术培训</p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-2">专业技能</h2>
          <ul className="list-inside list-disc space-y-2">
            <li>精通JS、Ajax、Jquery、EASYUI，Vue，React，Node，Vue-CLI，Vite，Webpack，Rollup，Esbuild等前端技术栈。</li>
            <li>熟悉Java基础体系架构，了解MVC开发模式，能熟练运用Java（包括JSP + Servlet）进行软件开发，具备相关项目经验，熟悉Spring、Spring-MVC、MyBatis、DWR等框架。</li>
            <li>熟悉Electron各类小程序，了解Android、iOS、鸿蒙OS、Flutter等跨端开发相关技术。</li>
            <li>深入了解浏览器渲染、安全等相关运行原理。</li>
            <li>熟悉MySQL、Oracle等应用型数据库。</li>
            <li>能独立安装、配置和调试开发用到的相关软件。</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-2">自我评价</h2>
          <p>对IT领域软件开发和设计工作兴趣浓厚，能承受较大工作压力。</p>
          <p>逻辑分析和自学能力强，工作认真踏实负责，专业素质良好，遇事沉着冷静，能理性看待和解决问题。</p>
          <p>为人诚恳、热心，能快速融入团队，善于团队管理、人员培训和沟通协调。</p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-2">工作经历</h2>
          <ul className="list-inside list-disc space-y-4">
            <li>
              <strong>云帐房网络科技有限公司（2022.6 - 2024.6）</strong> - 前端技术经理
              <ul className="ml-6 list-disc space-y-2">
                <li>负责前端团队管理，包括开发人员梯度建设和培训。</li>
                <li>进行前端框架技术选型，攻克技术难点，建设前端研发流程，把控产品需求评审。</li>
                <li>整理系统历史缺失的前端技术文档和业务文档，形成公司资产。</li>
                <li>推动技术架构演进，提供并落地合理方案。</li>
                <li>涉及云帐房核心产品财云（代账）SaaS平台，以及相关创新性产品如天工（代账的工厂）SaaS、迁移工具PC软件等。</li>
              </ul>
            </li>
            <li>
              <strong>解放号网络科技有限公司（2020.4 - 2022.6）</strong> - 前端架构师&敏捷SM
              <ul className="ml-6 list-disc space-y-2">
                <li>为平台提供统一前端架构，进行基础和底层封装，输出规范文档和安全文档。</li>
                <li>负责前端开发人员技能培训和前端团队管理。</li>
                <li>作为敏捷SM，负责平台移动端相关产品项目的开发迭代管理，涉及微信小程序、App Hybrids、H5等。</li>
                <li>参与平台重构和维护，涉及多个产品线，如智监、智采、人力。</li>
              </ul>
            </li>
            <li>
              <strong>联蔚科技信息有限公司（2018.8 - 2020.4）</strong> - Web Front-end Specialist
              <ul className="ml-6 list-disc space-y-2">
                <li>承担前端开发相关工作，重点开发重构架构工作。</li>
                <li>负责南京前端团队人员管理，负责开发人员招聘，组织培训等。</li>
                <li>对多个项目团队技术问题进行支撑。</li>
              </ul>
            </li>
            <li>
              <strong>中兴软创科技股份有限公司（2015.3 - 2018.8）</strong> - 开发经理（Java全栈）
              <ul className="ml-6 list-disc space-y-2">
                <li>负责相关开发管理工作。</li>
                <li>负责项目难点问题攻克以及开发。</li>
              </ul>
            </li>
            <li>
              <strong>江苏随手信息科技有限公司（2014.7 - 2015.3）</strong> - Web前端开发
              <ul className="ml-6 list-disc space-y-2">
                <li>根据设计稿和功能要求完成页面开发，依据后台接口返回信息进行页面更新、跳转和数据展示。</li>
              </ul>
            </li>
            <li>
              <strong>镇江青思网络科技有限公司（2013.7 - 2014.7）</strong> - Java软件工程师
              <ul className="ml-6 list-disc space-y-2">
                <li>参与相关项目开发。</li>
              </ul>
            </li>
            <li>
              <strong>实习经历</strong>
              <ul className="ml-6 list-disc space-y-2">
                <li><strong>南京速商在线网络科技有限公司（2012.7 - 2012.12）</strong> - PHP软件工程师</li>
                <li><strong>南京邮电大学物联网研究中心全网物联公司（2010.7 - 2010.9）</strong> - UI交互设计，静态网页</li>
              </ul>
            </li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-2">项目经验</h2>
          <ul className="list-inside list-disc space-y-4">
            <li>
              <strong>经纬财云</strong>
              <ul className="ml-6 list-disc space-y-2">
                <li><strong>开发周期：</strong>长期迭代更新</li>
                <li><strong>项目描述：</strong>SaaS平台软件，服务代账公司，垂直财税领域。</li>
                <li><strong>技术环境：</strong>React，Umi，Ant Design，Git，Electron，Node.js，Vue，UniApp，Egg.js，jQuery</li>
                <li><strong>职能&业绩：</strong>
                  <ul className="ml-6 list-disc space-y-2">
                    <li>构建优秀前端技术团队，人员能力梯度合理，开发投入度高。</li>
                    <li>整理系统历史缺失前端技术文档和业务文档，形成公司资产。</li>
                    <li>推动技术架构演进，提供并落地合理方案。</li>
                    <li>进行人员技术培养，营造团队氛围。</li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              <strong>解放号平台</strong>
              <ul className="ml-6 list-disc space-y-2">
                <li><strong>开发周期：</strong>长期迭代更新</li>
                <li><strong>项目描述：</strong>平台重构和维护，涉及多个产品线，如智监、智采、人力。</li>
                <li><strong>技术环境：</strong>前端Vue，React，微信小程序，Node后端微服务</li>
                <li><strong>职能描述：</strong>
                  <ul className="ml-6 list-disc space-y-2">
                    <li>提供统一前端架构，进行基础和底层封装，输出规范文档和安全文档。</li>
                    <li>负责前端开发人员技能培训和前端团队管理。</li>
                    <li>作为敏捷SM，负责移动端相关产品项目的开发迭代管理。</li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              <strong>安利云购（accl）</strong>
              <ul className="ml-6 list-disc space-y-2">
                <li><strong>开发周期：</strong>长期迭代更新</li>
                <li><strong>项目描述：</strong>直销商城</li>
                <li><strong>技术环境：</strong>前端：VSCode，Node，Git，Vue，React，jQuery，Webpack，微信小程序等等</li>
                <li><strong>职能描述：</strong>
                  <ul className="ml-6 list-disc space-y-2">
                    <li>负责公司南京ees部门前端框架搭建、优化和选型，前端小组管理，开发人员技术培训、技术支持和绩效考核。</li>
                    <li>涉及前端相关各方面技术，包括微信小程序、Vue、React等。</li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              <strong>江宁智慧交通，黑车识别，应急处置决策分析等系统及相关区域项目</strong>
              <ul className="ml-6 list-disc space-y-2">
                <li><strong>开发周期：</strong>2 - 4个月（各项目）</li>
                <li><strong>项目描述：</strong>按区域要求定制化，除日常功能开发外，主要负责部门技术架构维护、升级和预研引入新技术功能（主要在前端），以及开发人员定期培训、代码审核和组织学习等。</li>
                <li><strong>技术环境：</strong>Fish（基于Backbone，jQuery，Handlebar）前端框架，Spring MVC，Spring Boot，Shiro，MyBatis，Redis，Oracle等等</li>
              </ul>
            </li>
            <li>
              <strong>醴陵，邵阳，绥化智慧交通项目</strong>
              <ul className="ml-6 list-disc space-y-2">
                <li><strong>开发周期：</strong>约4个月</li>
                <li><strong>项目描述：</strong>按区域立项目，主要负责bug修复、新功能开发、基础框架修改和升级。涉及交通管理互联网化，为相关职能机构提供定制化功能，包括车辆、道路、告警、视频、地图等。</li>
                <li><strong>技术环境：</strong>Java Tomcat Redis Oracle MongoDB OCX（视频控件） GIS（地图功能）</li>
              </ul>
            </li>
            <li>
              <strong>舟山城市智慧交通，银川智慧城市交通</strong>
              <ul className="ml-6 list-disc space-y-2">
                <li><strong>开发周期：</strong>1年</li>
                <li><strong>项目描述：</strong>智慧城市、智慧交通相关，优化程序，美化页面，优化功能。</li>
                <li><strong>技术环境：</strong>Java Tomcat Redis Oracle MongoDB OCX（视频控件） GIS（地图功能） MQ</li>
              </ul>
            </li>
            <li>
              <strong>大数据管理平台</strong>
              <ul className="ml-6 list-disc space-y-2">
                <li><strong>开发周期：</strong>3个月</li>
                <li><strong>项目描述：</strong>主要是大数据相关的基础信息关联、引擎配置等功能。</li>
                <li><strong>技术环境：</strong>使用较新前端技术Fish，基于Require.js Node.js Backbone.js Handlebar.js等实现前端开发架构。</li>
              </ul>
            </li>
            <li>
              <strong>随手商户管理平台，运营平台，pc端商城</strong>
              <ul className="ml-6 list-disc space-y-2">
                <li><strong>开发周期：</strong>Pc端商城1个月，随手商户管理平台与运营平台2 - 3个月</li>
                <li><strong>项目描述：</strong>
                  <ul className="ml-6 list-disc space-y-2">
                    <li>Pc端商城将移动商城拓展至pc端，涉及商品分类展示、购买等功能。</li>
                    <li>随手商户平台为商户提供移动端销售平台，涉及产品上传管理、佣金结算、订单管理等功能。</li>
                    <li>运营平台供公司运营团队使用，涉及商户管理、用户管理、商品管理、消息推送等功能。</li>
                  </ul>
                </li>
                <li><strong>技术环境：</strong>Mysql Java Tomcat</li>
                <li><strong>工作描述：</strong>
                  <ul className="ml-6 list-disc space-y-2">
                    <li>主要负责web前端开发，采用JSP结合前端框架EasyUI jQuery Bootstrap等进行开发，运营平台尝试前后台分开开发，数据请求与获取主要采用Ajax方式。</li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
