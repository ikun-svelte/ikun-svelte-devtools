<script lang="ts">
    import { documentDetail } from '@ikun-svelte-devtools/shared';
    import {SvelteLogo as Logo} from '@ikun-svelte-devtools/icons';
    import {CarbonCarbon} from '@ikun-svelte-devtools/icons';
    import {CarbonQuery} from '@ikun-svelte-devtools/icons';
    import { KTooltip, KIcon } from "@ikun-ui/core";
    const logoDict = {
        Logo,
        CarbonCarbon,
        CarbonQuery
    } as Record<string, any>
</script>
<div class="grid grid-cols-2 grid-rows-2 gap-4 p-8 w-full min-h-full">
    {#each documentDetail as doc (doc.id)}
        <div class="flex p4 border border-solid border-main rounded-lg hover:animate-LianYi">
            <div class="flex-auto">
                <div class="flex items-center">
                    <svelte:component this={logoDict[doc.icon]} width="40px" height="40px"/>
                    <h1 class="text-2xl text-tx dark:text-white  mx-2">{doc.name}</h1>
                </div>
                <p class="
                text-md text-muted dark:text-white  my-4">{doc.description}</p>
            </div>
            <div class="flex-1 flex">
                <KTooltip content={doc.website} placement="top">
                    <a slot="triggerEl" href={doc.website} target="_blank">
                        <KIcon icon="i-carbon-link" color="text-tx-light" cls="m2"></KIcon>
                    </a>
                </KTooltip>
                <KTooltip content={doc.github} placement="top">
                    <a slot="triggerEl" href={doc.github} target="_blank">
                        <KIcon icon="i-carbon-logo-github" color="text-tx-light" cls="m2"></KIcon>
                    </a>
                </KTooltip>
            </div>
        </div>
    {/each}
</div>
