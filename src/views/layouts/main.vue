<script>
import {
    layoutComputed
} from "@/state/helpers";
import Horizontal from "./horizontal";

/**
 * Main Layout
 */
export default {
    components: {
        Horizontal,
    },
    data() {
        return {};
    },
    computed: {
        ...layoutComputed,
    },
    mounted() {
        document.body.classList.remove('authentication-bg')
    },
    methods: {},
};
</script>

<template>
<div>
    <Horizontal :layout="layoutType">
        <slot />
    </Horizontal>
</div>
</template>
